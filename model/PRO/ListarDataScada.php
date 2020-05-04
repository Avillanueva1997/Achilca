<?php

error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);

date_default_timezone_set('America/Lima');

require_once('../../security.php');
require '../DatosBD.php';
require '../Global_Functions.php';

$_fecha = $_POST['_fecha'];
$_fechaSubtractOne = date('Y-m-d', strtotime('-1 day', strtotime($_fecha)));
$_lastDay = date("Y-m-t", strtotime($_fecha));
$_month = $_POST['_month'];
$_month = $_month + 1;
$_year = $_POST['_year'];
$_lineaProduccion = $_POST['_lineaProduccion'];
$_turno = $_POST['_turno'];
$hour = date('G');
$hour = $hour.':00';
$_Type = $_POST['_Type'];

$responseEvaluationHour = evaluateHour($hour, '0:00', '8:00');
$responseEvaluationHourTurnoA = evaluateHour($hour, '8:00', '20:15');
$responseEvaluationHourTurnoB = evaluateHour($hour, '20:00', '8:15');

$firstDay = '01';
$firstFlag = false;

$firstDayDate = explode("-", $_fecha);
$firstDayDate = $firstDayDate[0].'-'.$firstDayDate[1].'-'.$firstDay;

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");
$secondCon = open_conection_sqlsrv($serverNameScadaL2, $connectionInfoScadaL2);
$thirdCon = open_conection_sqlsrv($serverNameScadaL3, $connectionInfoScadaL3);

$params = array();
$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET );

if($_Type == 'true'){
	$sqlFirst = "select t1.fecha, t1.diametro, t1.coord, t1.bar_charg, t1.bar_proces, t1.bar_reject, t1.hrs_disp, t1.hrs_pp, t1.sobre_peso, t1.bpm, t1.carga_fria, t1.produccion_neta, t1.bola_observada, t1.barra_rechazada, t1.scrap, t1.cascarilla, t1.eficiencia, t1.barra_chatarra, t1.uptime, t1.rendimiento, t1.calidad, t1.oee, t1.cuota, t1.por_cumplimiento
	from okrs t1
	where t1.fecha between '".$firstDayDate."' and '".$_fecha."' and t1.linea_produccion = '".$_lineaProduccion."' and t1.turno = '".$_turno."';";
} else {
	if($_turno == 'B' && $responseEvaluationHour && $responseEvaluationHourTurnoB) {
		$sqlFirst = "select t1.fecha, t1.diametro, t1.coord, t1.bar_charg, t1.bar_proces, t1.bar_reject, t1.hrs_disp, t1.hrs_pp, t1.sobre_peso, t1.bpm, t1.carga_fria, t1.produccion_neta, t1.bola_observada, t1.barra_rechazada, t1.scrap, t1.cascarilla, t1.eficiencia, t1.barra_chatarra, t1.uptime, t1.rendimiento, t1.calidad, t1.oee, t1.cuota, t1.por_cumplimiento
				from okrs t1
				where t1.fecha = '".$_fechaSubtractOne."' and t1.linea_produccion = '".$_lineaProduccion."' and t1.turno = '".$_turno."';";
	} else if($_turno == 'B' && !$responseEvaluationHour && $responseEvaluationHourTurnoB){
		$sqlFirst = "select t1.fecha, t1.diametro, t1.coord, t1.bar_charg, t1.bar_proces, t1.bar_reject, t1.hrs_disp, t1.hrs_pp, t1.sobre_peso, t1.bpm, t1.carga_fria, t1.produccion_neta, t1.bola_observada, t1.barra_rechazada, t1.scrap, t1.cascarilla, t1.eficiencia, t1.barra_chatarra, t1.uptime, t1.rendimiento, t1.calidad, t1.oee, t1.cuota, t1.por_cumplimiento
		from okrs t1
		where t1.fecha = '".$_fecha."' and t1.linea_produccion = '".$_lineaProduccion."' and t1.turno = '".$_turno."';";
	} else if($_turno == 'A' && $responseEvaluationHourTurnoA) {
		$sqlFirst = "select t1.fecha, t1.diametro, t1.coord, t1.bar_charg, t1.bar_proces, t1.bar_reject, t1.hrs_disp, t1.hrs_pp, t1.sobre_peso, t1.bpm, t1.carga_fria, t1.produccion_neta, t1.bola_observada, t1.barra_rechazada, t1.scrap, t1.cascarilla, t1.eficiencia, t1.barra_chatarra, t1.uptime, t1.rendimiento, t1.calidad, t1.oee, t1.cuota, t1.por_cumplimiento
				from okrs t1
				where t1.fecha = '".$_fecha."' and t1.linea_produccion = '".$_lineaProduccion."' and t1.turno = '".$_turno."';";
	} else {
		$sqlFirst = "select t1.fecha, t1.diametro, t1.coord, t1.bar_charg, t1.bar_proces, t1.bar_reject, t1.hrs_disp, t1.hrs_pp, t1.sobre_peso, t1.bpm, t1.carga_fria, t1.produccion_neta, t1.bola_observada, t1.barra_rechazada, t1.scrap, t1.cascarilla, t1.eficiencia, t1.barra_chatarra, t1.uptime, t1.rendimiento, t1.calidad, t1.oee, t1.cuota, t1.por_cumplimiento
		from okrs t1
		where t1.fecha between '".$firstDayDate."' and '".$_lastDay."' and t1.linea_produccion = '".$_lineaProduccion."' and t1.turno = '".$_turno."';";
	}
}

$resultFirst = mysqli_query($con,$sqlFirst);

	if (!$resultFirst ) {
		printf("Error message: %s\n", mysqli_error($con));
	}

	$row_count = mysqli_num_rows( $resultFirst );

	mysqli_free_result($resultFirst);

	if($row_count >= 1){

		$sqlOkrsData = "select t1.fecha, t1.diametro, t1.coord, t1.bar_charg, t1.bar_proces, t1.bar_reject, t1.hrs_disp, t1.hrs_pp, t1.sobre_peso, t1.bpm, t1.carga_fria, t1.produccion_neta, t1.bola_observada, t1.barra_rechazada, t1.scrap, t1.cascarilla, t1.eficiencia, t1.barra_chatarra, t1.uptime, t1.rendimiento, t1.calidad, t1.oee, t1.cuota, t1.por_cumplimiento, t3.factor, t2.bpm as bpmReal, t2.weight
						from okrs t1
						inner join ball t2 on t1.diametro = t2.length and t1.linea_produccion = t2.linea_produccion
						inner join factor_linea t3 on t1.linea_produccion = t3.linea_produccion
						where t1.fecha between '".$firstDayDate."' and '".$_fecha."' and t1.linea_produccion = '".$_lineaProduccion."' and t1.turno = '".$_turno."'
						order by t1.fecha asc;";

		$resultOkrsData = mysqli_query($con, $sqlOkrsData);

		if (!$resultOkrsData ) {
			printf("Error message: %s\n", mysqli_error($con));
		}

		$DataOkrs = array();

		while($row = mysqli_fetch_array($resultOkrsData)) 
		{ 	    
			
			$fecha=$row['fecha'];
			$diametro=$row['diametro'];
			$coord=$row['coord'];
			$bar_charg=$row['bar_charg'];
			$bar_proces=$row['bar_proces'];
			$bar_reject=$row['bar_reject'];
			$hrs_disp=$row['hrs_disp'];
			$hrs_pp=$row['hrs_pp'];
			$sobre_peso=$row['sobre_peso'];
			$bpm=$row['bpm'];
			$carga_fria=$row['carga_fria'];
			$produccion_neta=$row['produccion_neta'];
			$bola_observada=$row['bola_observada'];
			$barra_rechazada=$row['barra_rechazada'];
			$scrap=$row['scrap'];
			$cascarilla=$row['cascarilla'];
			$eficiencia=$row['eficiencia'];
			$barra_chatarra=$row['barra_chatarra'];
			$uptime=$row['uptime'];
			$rendimiento=$row['rendimiento'];
			$calidad=$row['calidad'];
			$oee=$row['oee'];
			$cuota=$row['cuota'];
			$por_cumplimiento=$row['por_cumplimiento'];
			$factor=$row['factor'];
			$bpmReal=$row['bpmReal'];
			$weight=$row['weight'];

			$DataOkrs[] = array(
									'fecha'=>$fecha,
									'diametro'=>$diametro,
									'coord'=>$coord,
									'bar_charg'=>$bar_charg,
									'bar_proces'=>$bar_proces,
									'bar_reject'=>$bar_reject,
									'hrs_disp'=>$hrs_disp,
									'hrs_pp'=>$hrs_pp,
									'sobre_peso'=>$sobre_peso,
									'bpm'=>$bpm,
									'carga_fria'=>$carga_fria,
									'produccion_neta'=>$produccion_neta,
									'bola_observada'=>$bola_observada,
									'barra_rechazada'=>$barra_rechazada,
									'scrap'=>$scrap,
									'cascarilla'=>$cascarilla,
									'eficiencia'=>$eficiencia,
									'barra_chatarra'=>$barra_chatarra,
									'uptime'=>$uptime,
									'rendimiento'=>$rendimiento,
									'calidad'=>$calidad,
									'oee'=>$oee,
									'cuota'=>$cuota,
									'por_cumplimiento'=>$por_cumplimiento,
									'factor'=>$factor,
									'bpmReal'=>$bpmReal,
									'weight'=>$weight,
									'State'=> 'Success'
			);
		}

		mysqli_free_result($resultOkrsData);

		$DataScada = $DataOkrs;

	} else {

		$sqlLastRecordByDate = "select fecha from okrs where linea_produccion = '".$_lineaProduccion."' and turno = '".$_turno."' and MONTH(fecha) = {$_month} and YEAR(fecha) = {$_year} and fecha = (select max(fecha) from okrs);";

		$resultLastRecordByDate = mysqli_query($con, $sqlLastRecordByDate);

		if (!$resultLastRecordByDate ) {
			printf("Error message: %s\n", mysqli_error($con));
		}

		$row_count_lastDate = mysqli_num_rows($resultLastRecordByDate);

		if($row_count_lastDate == 1){

			$row_lastDate = mysqli_fetch_assoc($resultLastRecordByDate);
			$lastFecha = $row_lastDate['fecha'];

			mysqli_free_result($resultLastRecordByDate);

		}

		if(isset($lastFecha) && $lastFecha != ''){

			$sqlOkrsData = "select t1.fecha, t1.diametro, t1.coord, t1.bar_charg, t1.bar_proces, t1.bar_reject, t1.hrs_disp, t1.hrs_pp, t1.sobre_peso, t1.bpm, t1.carga_fria, t1.produccion_neta, t1.bola_observada, t1.barra_rechazada, t1.scrap, t1.cascarilla, t1.eficiencia, t1.barra_chatarra, t1.uptime, t1.rendimiento, t1.calidad, t1.oee, t1.cuota, t1.por_cumplimiento, t3.factor, t2.bpm as bpmReal, t2.weight
			from okrs t1
			inner join ball t2 on t1.diametro = t2.length and t1.linea_produccion = t2.linea_produccion
			inner join factor_linea t3 on t1.linea_produccion = t3.linea_produccion
			where t1.fecha between '".$firstDayDate."' and '".$lastFecha."' and t1.linea_produccion = '".$_lineaProduccion."' and t1.turno = '".$_turno."'
			order by t1.fecha asc;";

			//print_r($sqlOkrsData);

			$resultOkrsData = mysqli_query($con, $sqlOkrsData);

			if (!$resultOkrsData ) {
				printf("Error message: %s\n", mysqli_error($con));
			}

			$DataOkrs = array();

			while($row = mysqli_fetch_array($resultOkrsData)) { 	    
				
				$fecha=$row['fecha'];
				$diametro=$row['diametro'];
				$coord=$row['coord'];
				$bar_charg=$row['bar_charg'];
				$bar_proces=$row['bar_proces'];
				$bar_reject=$row['bar_reject'];
				$hrs_disp=$row['hrs_disp'];
				$hrs_pp=$row['hrs_pp'];
				$sobre_peso=$row['sobre_peso'];
				$bpm=$row['bpm'];
				$carga_fria=$row['carga_fria'];
				$produccion_neta=$row['produccion_neta'];
				$bola_observada=$row['bola_observada'];
				$barra_rechazada=$row['barra_rechazada'];
				$scrap=$row['scrap'];
				$cascarilla=$row['cascarilla'];
				$eficiencia=$row['eficiencia'];
				$barra_chatarra=$row['barra_chatarra'];
				$uptime=$row['uptime'];
				$rendimiento=$row['rendimiento'];
				$calidad=$row['calidad'];
				$oee=$row['oee'];
				$cuota=$row['cuota'];
				$por_cumplimiento=$row['por_cumplimiento'];
				$factor=$row['factor'];
				$bpmReal=$row['bpmReal'];
				$weight=$row['weight'];

				$DataOkrs[] = array(
										'fecha'=>$fecha,
										'diametro'=>$diametro,
										'coord'=>$coord,
										'bar_charg'=>$bar_charg,
										'bar_proces'=>$bar_proces,
										'bar_reject'=>$bar_reject,
										'hrs_disp'=>$hrs_disp,
										'hrs_pp'=>$hrs_pp,
										'sobre_peso'=>$sobre_peso,
										'bpm'=>$bpm,
										'carga_fria'=>$carga_fria,
										'produccion_neta'=>$produccion_neta,
										'bola_observada'=>$bola_observada,
										'barra_rechazada'=>$barra_rechazada,
										'scrap'=>$scrap,
										'cascarilla'=>$cascarilla,
										'eficiencia'=>$eficiencia,
										'barra_chatarra'=>$barra_chatarra,
										'uptime'=>$uptime,
										'rendimiento'=>$rendimiento,
										'calidad'=>$calidad,
										'oee'=>$oee,
										'cuota'=>$cuota,
										'por_cumplimiento'=>$por_cumplimiento,
										'factor'=>$factor,
										'bpmReal'=>$bpmReal,
										'weight'=>$weight,
										'State' => 'Success'
				);
			}

			mysqli_free_result($resultOkrsData);

			$bar_charg = 0;
			$bar_proces = 0;
			$bar_reject = 0;

			$uptime = 0;
			$rendimiento = 0;
			$oee = 0;

			if($_turno == 'A'){
				$sqlOne = "select Val from [{$_lineaProduccion}_turno_a_carga] where [DateAndTime] = (select max([DateAndTime]) from [{$_lineaProduccion}_turno_a_carga]);";
				$sqlSecond = "select Val from [{$_lineaProduccion}_turno_a_descarga] where [DateAndTime] = (select max([DateAndTime]) from [{$_lineaProduccion}_turno_a_descarga]);";
				$sqlThird = "select Val from [{$_lineaProduccion}_turno_a_rechazo] where [DateAndTime] = (select max([DateAndTime]) from [{$_lineaProduccion}_turno_a_rechazo]);";
			} else if($_turno == 'B'){
				$sqlOne = "select Val from [{$_lineaProduccion}_turno_c_carga] where [DateAndTime] = (select max([DateAndTime]) from [{$_lineaProduccion}_turno_c_carga]);";
				$sqlSecond = "select Val from [{$_lineaProduccion}_turno_c_descarga] where [DateAndTime] = (select max([DateAndTime]) from [{$_lineaProduccion}_turno_c_descarga]);";
				$sqlThird = "select Val from [{$_lineaProduccion}_turno_c_rechazo] where [DateAndTime] = (select max([DateAndTime]) from [{$_lineaProduccion}_turno_c_rechazo]);";
			}

			//print_r($sqlOne);
			//print_r($sqlSecond);
			//print_r($sqlThird);

			if($_lineaProduccion == 'L2'){

				$resultOne = sqlsrv_query($secondCon, $sqlOne, $params, $options);

				if( $resultOne === false) {
					die( print_r( sqlsrv_errors(), true) );
				}

				while($row = sqlsrv_fetch_array($resultOne, SQLSRV_FETCH_ASSOC)) 
				{ 	    
					
					$bar_charg = $row['Val'];
				}

				sqlsrv_free_stmt($resultOne);

				$resultSecond = sqlsrv_query($secondCon, $sqlSecond, $params, $options);

				if( $resultSecond === false) {
					die( print_r( sqlsrv_errors(), true) );
				}

				while($row = sqlsrv_fetch_array($resultSecond, SQLSRV_FETCH_ASSOC)) 
				{ 	    
					
					$bar_proces = $row['Val'];
				}

				sqlsrv_free_stmt($resultSecond);

				$resultThird = sqlsrv_query($secondCon, $sqlThird, $params, $options);

				if( $resultThird === false) {
					die( print_r( sqlsrv_errors(), true) );
				}

				while($row = sqlsrv_fetch_array($resultThird, SQLSRV_FETCH_ASSOC)) 
				{ 	    
					
					$bar_reject = $row['Val'];
				}

				sqlsrv_free_stmt($resultThird);

			} else if($_lineaProduccion == 'L3'){

				$resultOne = sqlsrv_query($thirdCon, $sqlOne, $params, $options);

				if( $resultOne === false) {
					die( print_r( sqlsrv_errors(), true) );
				}

				while($row = sqlsrv_fetch_array($resultOne, SQLSRV_FETCH_ASSOC)) 
				{ 	    
					
					$bar_charg = $row['Val'];
				}

				sqlsrv_free_stmt($resultOne);

				$resultSecond = sqlsrv_query($thirdCon, $sqlSecond, $params, $options);

				if( $resultSecond === false) {
					die( print_r( sqlsrv_errors(), true) );
				}

				while($row = sqlsrv_fetch_array($resultSecond, SQLSRV_FETCH_ASSOC)) 
				{ 	    
					
					$bar_proces = $row['Val'];
				}

				sqlsrv_free_stmt($resultSecond);

				$resultThird = sqlsrv_query($thirdCon, $sqlThird, $params, $options);

				if( $resultThird === false) {
					die( print_r( sqlsrv_errors(), true) );
				}

				while($row = sqlsrv_fetch_array($resultThird, SQLSRV_FETCH_ASSOC)) 
				{ 	    
					
					$bar_reject = $row['Val'];
				}

				sqlsrv_free_stmt($resultThird);

			}

			if($_turno == 'B' && $responseEvaluationHour) {

				$sqlDataScada = "select t1.start_date, t1.diametro, t1.hrs_pp, t2.weight as weight_bar, t3.factor, t5.bpm as bpmReal, t5.bpmPropuesto, t5.weight as weight_ball, t5.meta, t6.grupo, t7.coord
				from programa_produccion t1
				inner join info_barra t2 on t1.diametro = t2.length 
				inner join factor_linea t3 on t1.linea_produccion = t3.linea_produccion
				inner join ball t5 on t1.linea_produccion = t5.linea_produccion and t1.diametro = t5.length
				inner join tt_produccion t6 on t1.turno = t6.turno and date(t1.start_date) = date(t6.start_date)
				inner join coord_inspect t7 on t7.grupo = t6.grupo
				where date(t1.start_date) = '".$_fechaSubtractOne."' and t1.linea_produccion = '".$_lineaProduccion."' and t1.turno = '".$_turno."' order by t1.start_date asc;";

			} else {

				$sqlDataScada = "select t1.start_date, t1.diametro, t1.hrs_pp, t2.weight as weight_bar, t3.factor, t5.bpm as bpmReal, t5.bpmPropuesto, t5.weight as weight_ball, t5.meta, t6.grupo, t7.coord
				from programa_produccion t1
				inner join info_barra t2 on t1.diametro = t2.length 
				inner join factor_linea t3 on t1.linea_produccion = t3.linea_produccion
				inner join ball t5 on t1.linea_produccion = t5.linea_produccion and t1.diametro = t5.length
				inner join tt_produccion t6 on t1.turno = t6.turno and date(t1.start_date) = date(t6.start_date)
				inner join coord_inspect t7 on t7.grupo = t6.grupo
				where date(t1.start_date) = '".$_fecha."' and t1.linea_produccion = '".$_lineaProduccion."' and t1.turno = '".$_turno."' order by t1.start_date asc;";

			}

			//print_r($sqlDataScada);

			$resultDataScada = mysqli_query($con, $sqlDataScada);

			if (!$resultDataScada ) {
				printf("Error message: %s\n", mysqli_error($con));
			}

			$DataScada = array();

			while($row = mysqli_fetch_array($resultDataScada)) 
			{ 	    
				
				$start_date=$row['start_date'];
				$diametro=$row['diametro'];
				$hrs_pp=$row['hrs_pp'];
				$weight_bar=$row['weight_bar'];
				$factor=$row['factor'];
				$coord=$row['coord'];
				$bpmReal=$row['bpmReal'];
				$bpmPropuesto=$row['bpmPropuesto'];
				$weight_ball=$row['weight_ball'];
				$meta=$row['meta'];
				
				//Others
				$cargaFria = ($bar_proces + $bar_reject) * $weight_bar / 1000;
				$cargaFria = round($cargaFria, 2);
				$barraRechazada = $bar_reject * ($weight_bar / 1000);
				$barraRechazada = round($barraRechazada, 2);
				$cascarilla = ($cargaFria - $barraRechazada) * $factor;
				$cascarilla = round($cascarilla, 2);
				if($cargaFria != 0){
					$barraChatarra = $barraRechazada / $cargaFria;
					$barraChatarra = $barraChatarra * 100;
					$barraChatarra = round($barraChatarra, 2);
				} else {
					$barraChatarra = 0;
				}
				$cuota = $meta * (12 - $hrs_pp);
				$cuota = round($cuota, 2);

				$uptime = ((0 + 0 + 0) / (((13 / 100) + 1) * $weight_ball * $bpmPropuesto * 60 / 1000)) / (12 - $hrs_pp);
				$uptime = $uptime * 100;
				$uptime = fmod($uptime, 1) != 0? toFixed($uptime, 2):$uptime;
				$rendimiento = $bpmPropuesto / $bpmReal;
				$rendimiento = $rendimiento * 100;
				$rendimiento = fmod($rendimiento, 1) != 0 ? toFixed($rendimiento, 2):$rendimiento;
				$oee = ($uptime / 100) * ($rendimiento / 100) * (0 / 100);
				$oee = $oee * 100;
				$oee = fmod($oee, 1) != 0 ? toFixed($oee, 2):$oee;

				$produccionNeta = $cargaFria - (0 + $barraRechazada + 0 + $cascarilla);
				$produccionNeta = round($produccionNeta, 2);

				$DataScada[] = array(
										'fecha'=>$start_date,
										'diametro'=>$diametro,
										'coord'=>$coord,
										'bar_charg'=>$bar_charg,
										'bar_proces'=>$bar_proces,
										'bar_reject'=>$bar_reject,
										'hrs_disp'=> 12,
										'hrs_pp'=> $hrs_pp,
										'sobre_peso'=> 13,
										'bpm'=> $bpmPropuesto,
										'carga_fria'=> $cargaFria,
										'produccion_neta'=> $produccionNeta,
										'bola_observada'=> 0.00	,
										'barra_rechazada'=> $barraRechazada,
										'scrap'=> 0.00,
										'cascarilla'=> $cascarilla,
										'eficiencia'=> 0,
										'barra_chatarra'=> $barraChatarra,
										'uptime'=> $uptime,
										'rendimiento'=> $rendimiento,
										'calidad'=> 0,
										'oee'=> $oee,
										'cuota'=> $cuota,
										'por_cumplimiento'=> 0,
										'factor'=> $factor,
										'bpmReal' => $bpmReal,
										'weight' => $weight_ball,
										'State' => 'Error'
				);
			}

			mysqli_free_result($resultDataScada);

			$DataScada = array_merge($DataOkrs,$DataScada);

		} else {

			$bar_charg = 0;
			$bar_proces = 0;
			$bar_reject = 0;

			$uptime = 0;
			$rendimiento = 0;
			$oee = 0;

			if($_turno == 'A'){
				$sqlOne = "select Val from [{$_lineaProduccion}_turno_a_carga] where [DateAndTime] = (select max([DateAndTime]) from [{$_lineaProduccion}_turno_a_carga]);";
				$sqlSecond = "select Val from [{$_lineaProduccion}_turno_a_descarga] where [DateAndTime] = (select max([DateAndTime]) from [{$_lineaProduccion}_turno_a_descarga]);";
				$sqlThird = "select Val from [{$_lineaProduccion}_turno_a_rechazo] where [DateAndTime] = (select max([DateAndTime]) from [{$_lineaProduccion}_turno_a_rechazo]);";
			} else if($_turno == 'B'){
				$sqlOne = "select Val from [{$_lineaProduccion}_turno_c_carga] where [DateAndTime] = (select max([DateAndTime]) from [{$_lineaProduccion}_turno_c_carga]);";
				$sqlSecond = "select Val from [{$_lineaProduccion}_turno_c_descarga] where [DateAndTime] = (select max([DateAndTime]) from [{$_lineaProduccion}_turno_c_descarga]);";
				$sqlThird = "select Val from [{$_lineaProduccion}_turno_c_rechazo] where [DateAndTime] = (select max([DateAndTime]) from [{$_lineaProduccion}_turno_c_rechazo]);";
			}

			//print_r($sqlOne);
			//print_r($sqlSecond);
			//print_r($sqlThird);

			if($_lineaProduccion == 'L2'){

				$resultOne = sqlsrv_query($secondCon, $sqlOne, $params, $options);

				if( $resultOne === false) {
					die( print_r( sqlsrv_errors(), true) );
				}

				while($row = sqlsrv_fetch_array($resultOne, SQLSRV_FETCH_ASSOC)) 
				{ 	    
					
					$bar_charg = $row['Val'];
				}

				sqlsrv_free_stmt($resultOne);

				$resultSecond = sqlsrv_query($secondCon, $sqlSecond, $params, $options);

				if( $resultSecond === false) {
					die( print_r( sqlsrv_errors(), true) );
				}

				while($row = sqlsrv_fetch_array($resultSecond, SQLSRV_FETCH_ASSOC)) 
				{ 	    
					
					$bar_proces = $row['Val'];
				}

				sqlsrv_free_stmt($resultSecond);

				$resultThird = sqlsrv_query($secondCon, $sqlThird, $params, $options);

				if( $resultThird === false) {
					die( print_r( sqlsrv_errors(), true) );
				}

				while($row = sqlsrv_fetch_array($resultThird, SQLSRV_FETCH_ASSOC)) 
				{ 	    
					
					$bar_reject = $row['Val'];
				}

				sqlsrv_free_stmt($resultThird);

			} else if($_lineaProduccion == 'L3'){

				$resultOne = sqlsrv_query($thirdCon, $sqlOne, $params, $options);

				if( $resultOne === false) {
					die( print_r( sqlsrv_errors(), true) );
				}

				while($row = sqlsrv_fetch_array($resultOne, SQLSRV_FETCH_ASSOC)) 
				{ 	    
					
					$bar_charg = $row['Val'];
				}

				sqlsrv_free_stmt($resultOne);

				$resultSecond = sqlsrv_query($thirdCon, $sqlSecond, $params, $options);

				if( $resultSecond === false) {
					die( print_r( sqlsrv_errors(), true) );
				}

				while($row = sqlsrv_fetch_array($resultSecond, SQLSRV_FETCH_ASSOC)) 
				{ 	    
					
					$bar_proces = $row['Val'];
				}

				sqlsrv_free_stmt($resultSecond);

				$resultThird = sqlsrv_query($thirdCon, $sqlThird, $params, $options);

				if( $resultThird === false) {
					die( print_r( sqlsrv_errors(), true) );
				}

				while($row = sqlsrv_fetch_array($resultThird, SQLSRV_FETCH_ASSOC)) 
				{ 	    
					
					$bar_reject = $row['Val'];
				}

				sqlsrv_free_stmt($resultThird);

			}

				if($_turno == 'B' && $responseEvaluationHour) {

					$sqlDataScada = "select t1.start_date, t1.diametro, t1.hrs_pp, t2.weight as weight_bar, t3.factor, t5.bpm as bpmReal, t5.bpmPropuesto, t5.weight as weight_ball, t5.meta, t6.grupo, t7.coord
					from programa_produccion t1
					inner join info_barra t2 on t1.diametro = t2.length 
					inner join factor_linea t3 on t1.linea_produccion = t3.linea_produccion
					inner join ball t5 on t1.linea_produccion = t5.linea_produccion and t1.diametro = t5.length
					inner join tt_produccion t6 on t1.turno = t6.turno and date(t1.start_date) = date(t6.start_date)
					inner join coord_inspect t7 on t7.grupo = t6.grupo
					where date(t1.start_date) = '".$_fechaSubtractOne."' and t1.linea_produccion = '".$_lineaProduccion."' and t1.turno = '".$_turno."' order by t1.start_date asc;";
		
				} else {
		
					$sqlDataScada = "select t1.start_date, t1.diametro, t1.hrs_pp, t2.weight as weight_bar, t3.factor, t5.bpm as bpmReal, t5.bpmPropuesto, t5.weight as weight_ball, t5.meta, t6.grupo, t7.coord
					from programa_produccion t1
					inner join info_barra t2 on t1.diametro = t2.length 
					inner join factor_linea t3 on t1.linea_produccion = t3.linea_produccion
					inner join ball t5 on t1.linea_produccion = t5.linea_produccion and t1.diametro = t5.length
					inner join tt_produccion t6 on t1.turno = t6.turno and date(t1.start_date) = date(t6.start_date)
					inner join coord_inspect t7 on t7.grupo = t6.grupo
					where date(t1.start_date) = '".$_fecha."' and t1.linea_produccion = '".$_lineaProduccion."' and t1.turno = '".$_turno."' order by t1.start_date asc;";
		
				}

				//print_r($sqlDataScada);
		
				$resultDataScada = mysqli_query($con, $sqlDataScada);
		
				if (!$resultDataScada ) {
					printf("Error message: %s\n", mysqli_error($con));
				}
		
				$DataScada = array();
		
				while($row = mysqli_fetch_array($resultDataScada)) 
				{ 	    
					
					$start_date=$row['start_date'];
					$diametro=$row['diametro'];
					$hrs_pp=$row['hrs_pp'];
					$weight_bar=$row['weight_bar'];
					$factor=$row['factor'];
					$coord=$row['coord'];
					$bpmReal=$row['bpmReal'];
					$bpmPropuesto=$row['bpmPropuesto'];
					$weight_ball=$row['weight_ball'];
					$meta=$row['meta'];
					
					//Others
					$cargaFria = ($bar_proces + $bar_reject) * $weight_bar / 1000;
					$cargaFria = round($cargaFria, 2);
					$barraRechazada = $bar_reject * ($weight_bar / 1000);
					$barraRechazada = round($barraRechazada, 2);
					$cascarilla = ($cargaFria - $barraRechazada) * $factor;
					$cascarilla = round($cascarilla, 2);
					if($cargaFria != 0){
						$barraChatarra = $barraRechazada / $cargaFria;
						$barraChatarra = $barraChatarra * 100;
						$barraChatarra = round($barraChatarra, 2);
					} else {
						$barraChatarra = 0;
					}
					$cuota = $meta * (12 - $hrs_pp);
					$cuota = round($cuota, 2);
		
					$uptime = ((0 + 0 + 0) / (((13 / 100) + 1) * $weight_ball * $bpmPropuesto * 60 / 1000)) / (12 - $hrs_pp);
					$uptime = $uptime * 100;
					$uptime = fmod($uptime, 1) != 0? toFixed($uptime, 2):$uptime;
					$rendimiento = $bpmPropuesto / $bpmReal;
					$rendimiento = $rendimiento * 100;
					$rendimiento = fmod($rendimiento, 1) != 0 ? toFixed($rendimiento, 2):$rendimiento;
					$oee = ($uptime / 100) * ($rendimiento / 100) * (0 / 100);
					$oee = $oee * 100;
					$oee = fmod($oee, 1) != 0 ? toFixed($oee, 2):$oee;
		
					$produccionNeta = $cargaFria - (0 + $barraRechazada + 0 + $cascarilla);
					$produccionNeta = round($produccionNeta, 2);
		
					$DataScada[] = array(
											'fecha'=>$start_date,
											'diametro'=>$diametro,
											'coord'=>$coord,
											'bar_charg'=>$bar_charg,
											'bar_proces'=>$bar_proces,
											'bar_reject'=>$bar_reject,
											'hrs_disp'=> 12,
											'hrs_pp'=> $hrs_pp,
											'sobre_peso'=> 13,
											'bpm'=> $bpmPropuesto,
											'carga_fria'=> $cargaFria,
											'produccion_neta'=> $produccionNeta,
											'bola_observada'=> 0.00	,
											'barra_rechazada'=> $barraRechazada,
											'scrap'=> 0.00,
											'cascarilla'=> $cascarilla,
											'eficiencia'=> 0,
											'barra_chatarra'=> $barraChatarra,
											'uptime'=> $uptime,
											'rendimiento'=> $rendimiento,
											'calidad'=> 0,
											'oee'=> $oee,
											'cuota'=> $cuota,
											'por_cumplimiento'=> 0,
											'factor'=> $factor,
											'bpmReal' => $bpmReal,
											'weight' => $weight_ball,
											'State' => 'Error'
					);
				}
		
				mysqli_free_result($resultDataScada);

		}
	}

	close_conection($con);
	close_conection_sqlsrv($secondCon);
	close_conection_sqlsrv($thirdCon);

	$json_string = json_encode($DataScada);

	echo $json_string;

	function evaluateHour($hour, $start, $end){
		$currentTime = strtotime($hour);
		$startTime = strtotime($start);
		$endTime = strtotime($end);

		if (
				(
				$startTime < $endTime &&
				$currentTime >= $startTime &&
				$currentTime <= $endTime
				) ||
				(
				$startTime > $endTime && (
				$currentTime >= $startTime ||
				$currentTime <= $endTime
				)
				)
		) {
			return true;
		} else {
			return false;
		}
	}
?>