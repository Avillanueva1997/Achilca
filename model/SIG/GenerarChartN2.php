<?php

require_once('../../security.php');
require '../DatosBD.php';

$_Auditoria = $_POST['_Auditoria'];

$_Views = array();

$_Views[] = array(
    'view' => 'sgc'
);

$_Views[] = array(
    'view' => 'sgma'
);

$_Views[] = array(
    'view' => 'sgs'
);

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$Data = array();

for ($i=0; $i < sizeof($_Views) ; $i++) { 
    $info = $_Views[$i]['view'];
    $info = strtolower($info);
    $infoMayus = strtoupper($info);

    $sqlSecond = "select * from {$info} where code = '".$_Auditoria."';";

    $resultSecond = mysqli_query($con,$sqlSecond);

    if (!$resultSecond) {
        printf("Error message: %s\n", mysqli_error($con));
    }

    while($row = mysqli_fetch_array($resultSecond)) 
    {
        $no_cfd_mayor = $row['no_cfd_mayor'];
        $no_cfd_menor = $row['no_cfd_menor'];
        $obs = $row['obs'];

        $Data[] = array(
                                'Type'=>$infoMayus,
                                'no_cfd_mayor'=>$no_cfd_mayor,
                                'no_cfd_menor'=>$no_cfd_menor,
                                'obs'=>$obs
                            );
    }

    mysqli_free_result($resultSecond);


}

close_conection($con);

$json_string = json_encode($Data);

echo $json_string;
?>