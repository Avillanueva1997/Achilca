<?php 

require_once('../../security.php');
require '../DatosBD.php';
require '../Global_Functions.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$_Year = $_POST['_Year'];   
$_MinusOneYear = $_Year - 1;

$DataKpi = array();

$sql = "select sum(costo_real) as Value from costo_trf_kpi where year = '".$_MinusOneYear."';";

$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$row_count = mysqli_num_rows( $result );

if($row_count == 1){

    while( $row = mysqli_fetch_array($result) ) {

        $Promedio = $row['Value'] / 12;
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

    $sql = "select meta, costo_real from costo_trf_kpi where year = '".$_Year."' and month = '".$code."';";

    $result = mysqli_query($con,$sql);

    if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
    }

    $row_count = mysqli_num_rows( $result );

    if($row_count != 0){

        while( $row = mysqli_fetch_array($result) ) {

            //var_dump($row);

            $Promedio +=  $row['costo_real'];

            $Desempenio = ($row['meta'] != 0) ? ($row['costo_real'] / $row['meta']) - 1 : 0;
            $Desempenio = $Desempenio * 100;
            $Desempenio = round($Desempenio,1);

            $DataKpi[] = array(          
                'CodeMonth'=> $code,
                'Month'=> $description,
                'Value'=> round($row['costo_real'], 1),
                'Meta' => $row['meta'],
                'desempenio' => $Desempenio
            );
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
$Promedio = round($Promedio, 1);

$DataKpi[] = array(         
    'Month'=> 'PROM.',
    'Value'=> $Promedio
);

close_conection($con);

$json_string = json_encode($DataKpi);

echo $json_string;

?>