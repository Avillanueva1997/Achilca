<?php 

require_once('../../security.php');
require '../DatosBD.php';
require '../Global_Functions.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$_Year = $_POST['_Year'];
$_Linea = $_POST['_Linea'];
$_MinusOneYear = $_Year - 1;
$month = date('m');

$DataKpi = array();

$Meta = 0;

$sql ="select meta from meta_eficiencia where year = {$_Year} and linea_produccion = '".$_Linea."';";

$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$row_count = mysqli_num_rows( $result );

if($row_count == 1){
    while( $row = mysqli_fetch_array($result) ) {

        $Meta = $row['meta'];
    }
}

mysqli_free_result($result);

$sql = "select sum(eficiencia) as Value from cierre_okrs where YEAR(fecha)  = '".$_MinusOneYear."' and linea_produccion = '".$_Linea."';";

$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$row_count = mysqli_num_rows( $result );

if($row_count == 1){
    while( $row = mysqli_fetch_array($result) ) {
        if(!empty($row['Value'])){
            $Promedio = $row['Value'] / 12;
            $Promedio = round($Promedio, 3);

            $DataKpi[] = array(          
                'Month'=> $_MinusOneYear,
                'Value'=> $Promedio
            );
        } else {
            $sql = "select avg(data_real) as Value from database_eficiencia where year = '".$_MinusOneYear."' and linea_produccion = '".$_Linea."';";

            $result = mysqli_query($con,$sql);

            if (!$result) {
                printf("Error message: %s\n", mysqli_error($con));
            }

            $row_count = mysqli_num_rows( $result );

            if($row_count == 1){
                while( $row = mysqli_fetch_array($result) ) {
                    if(!empty($row['Value'])){
                        $Promedio = $row['Value'] / 100;
                        $Promedio = round($Promedio, 3);

                        $DataKpi[] = array(          
                            'Month'=> $_MinusOneYear,
                            'Value'=> $Promedio
                        );
                    } else {
                        $DataKpi[] = array(            
                            'Month'=> $_MinusOneYear,
                            'Value'=> 0
                        );
                    }
                }
            } else {
                $DataKpi[] = array(            
                    'Month'=> $_MinusOneYear,
                    'Value'=> 0
                );
            }            
        }
    }
} else {
    $DataKpi[] = array(            
        'Month'=> $_MinusOneYear,
        'Value'=> 0
    );
}

mysqli_free_result($result);

$sqlMonth = "select * from month;";

$resultMonth = mysqli_query($con,$sqlMonth);

if (!$resultMonth ) {
    printf("Error message: %s\n", mysqli_error($con));
}

$Promedio = 0;

while($row = mysqli_fetch_array($resultMonth)) 
{ 	    
    $code=$row['code'];
    $description=$row['description'];

    $sql = "select avg(eficiencia) as Value from cierre_okrs where YEAR(fecha)  = '".$_Year."' and MONTH(fecha) = '".$code."' and linea_produccion = '".$_Linea."';";        

    $result = mysqli_query($con,$sql);

    if (!$result  ) {
    printf("Error message: %s\n", mysqli_error($con));
    }

    $row_count = mysqli_num_rows( $result );

    if($row_count != 0){

        while( $row = mysqli_fetch_array($result) ) {

            $Promedio +=  $row['Value'];

            if($row['Value'] == 0 || empty($row['Value'])){
                $DataKpi[] = array(          
                    'CodeMonth'=> $code,
                    'Month'=> $description,
                    'Value'=> round(0, 3),
                    'Meta' => 0,
                    'desempenio' => 0
                );
            } else {
                $Desempenio = (($row['Value'] * 100) / ($Meta * 100)) - 1;
                //$Desempenio = $Desempenio * 100;
                $Desempenio = round($Desempenio,3);

                $Value = $row['Value'] / 100;
                $Value = round($Value,3);
                $Meta = $Meta / 100;
                $Meta = round($Meta,3);

                $DataKpi[] = array(          
                    'CodeMonth'=> $code,
                    'Month'=> $description,
                    'Value'=> $Value,
                    //'Value'=>toFixed($row['Value'], 1),
                    'Meta'=> $Meta,
                    'desempenio' => $Desempenio
                );

            }
        }

    } else {
        $DataKpi[] = array(       
            'CodeMonth'=> $code,           
            'Month'=> $description,
            'Value'=> 0,
            'Meta' => 0,
            'desempenio' => 0
        );
    }

    mysqli_free_result($result);
}

mysqli_free_result($resultMonth);

$Promedio = $Promedio / 12;
$Promedio = $Promedio / 100;
$Promedio = round($Promedio, 3);

$DataKpi[] = array(         
    'Month'=> 'PROM.',
    'Value'=> $Promedio
);

close_conection($con);

$json_string = json_encode($DataKpi);

echo $json_string;

?>