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

$sql = "select sum(produccion_neta) as Value from cierre_okrs where YEAR(fecha)  = '".$_MinusOneYear."' and linea_produccion = '".$_Linea."';";

$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$row_count = mysqli_num_rows( $result );

if($row_count == 1){

    while( $row = mysqli_fetch_array($result) ) {

        if($row['Value'] != 0 || !empty($row['Value'])){
            $Promedio = $row['Value'] / 12;
            $Promedio = round($Promedio, 1);

            $DataKpi[] = array(          
                'Month'=> $_MinusOneYear,
                'Value'=> $Promedio
            );

        } else {
        $sql = "select avg(data_real) as Value from database_produccion where year = '".$_MinusOneYear."' and linea_produccion = '".$_Linea."';";

        $result = mysqli_query($con,$sql);

        if (!$result) {
            printf("Error message: %s\n", mysqli_error($con));
        }

        $row_count = mysqli_num_rows( $result );

        if($row_count == 1){

            while( $row = mysqli_fetch_array($result) ) {

                $Promedio = $row['Value'];
                $Promedio = round($Promedio, 1);

                $DataKpi[] = array(          
                    'Month'=> $_MinusOneYear,
                    'Value'=> $Promedio
                );
            }

        } else {
            $DataKpi[] = array(            
                'Month'=> $_MinusOneYear,
                'Value'=> 0
            );
        }
        }
    }

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

    if($_Year == '2020' && $code <= 5){
        $sql = "select data_real as Value, meta from database_produccion where year = '".$_Year."' and month = '".$code."' and linea_produccion = '".$_Linea."';";        

        $result = mysqli_query($con,$sql);
    
        if (!$result) {
        printf("Error message: %s\n", mysqli_error($con));
        }
    
        $row_count = mysqli_num_rows( $result );
    
        if($row_count != 0){
    
            while( $row = mysqli_fetch_array($result) ) {
    
                $Promedio +=  $row['Value'];
    
                $DataKpi[] = array(          
                    'CodeMonth'=> $code,
                    'Month'=> $description,
                    'Value'=> round($row['Value'], 1),
                    'Meta'=> $row['meta']
                );
            }
    
        } else {
            $DataKpi[] = array(       
                'CodeMonth'=> $code,           
                'Month'=> $description,
                'Value'=> 0,
                'Meta'=> 0
            );
        }
    
        mysqli_free_result($result);
    } else {
        $sql = "select sum(produccion_neta) as Value from cierre_okrs where YEAR(fecha)  = '".$_Year."' and MONTH(fecha) = '".$code."' and linea_produccion = '".$_Linea."';";        

        $result = mysqli_query($con,$sql);
    
        if (!$result) {
        printf("Error message: %s\n", mysqli_error($con));
        }
    
        $row_count = mysqli_num_rows( $result );
    
        if($row_count != 0){
    
            while( $row = mysqli_fetch_array($result) ) {
    
                $Promedio +=  $row['Value'];
    
                $DataKpi[] = array(          
                    'CodeMonth'=> $code,
                    'Month'=> $description,
                    'Value'=> round($row['Value'], 1)
                );
            }
    
        } else {
            $DataKpi[] = array(       
                'CodeMonth'=> $code,           
                'Month'=> $description,
                'Value'=> 0
            );
        }
    
        mysqli_free_result($result);
    }
}

mysqli_free_result($resultMonth);


for ($i=0; $i < sizeof($DataKpi) ; $i++) { 
    if(array_key_exists("CodeMonth",$DataKpi[$i])){
        if($_Year != '2020' && $DataKpi[$i]['CodeMonth'] > 5){
            $sql = "select sum(tm) as Meta from programa_produccion where YEAR(start_date) = '".$_Year."' and MONTH(start_date) = '".$DataKpi[$i]['CodeMonth']."' and linea_produccion = '".$_Linea."';";

            $result = mysqli_query($con,$sql);
    
            if (!$result  ) {
                printf("Error message: %s\n", mysqli_error($con));
            }
    
            $Meta = 0;
    
            while( $row = mysqli_fetch_array($result) ) {
                $Meta=$row['Meta'];
                $Meta= intval($Meta);
            }
    
            $DataKpi[$i]['Meta'] = $Meta;
        }
    }
}

for ($i=0; $i < sizeof($DataKpi) ; $i++) { 
    if(array_key_exists("CodeMonth",$DataKpi[$i]) && $DataKpi[$i]["CodeMonth"] <= intval($month) ){
        $meta = $DataKpi[$i]['Meta'];
        if($meta > 0){
            $value = $DataKpi[$i]['Value'];
            $desempenio = ($value / $meta) - 1;
            $desempenio *= 100;
            $DataKpi[$i]['desempenio'] = round($desempenio, 1);
        }
    }
}

$Promedio = $Promedio / 12;
$Promedio = round($Promedio, 1);

$DataKpi[] = array(         
    'Month'=> 'PROM.',
    'Value'=> $Promedio
);

close_conection($con);

$json_string = json_encode($DataKpi);

echo $json_string;

?>