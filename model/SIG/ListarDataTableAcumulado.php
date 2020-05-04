<?php

require_once('../../security.php');
require '../DatosBD.php';

$sql = "select info from nodos where view like 'sig01%';";
$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$Data = array();

$string = 'select code,no_cfd_mayor,no_cfd_menor, obs
from sgc
union all
select code,no_cfd_mayor,no_cfd_menor, obs
from sgma
union all
select code,no_cfd_mayor,no_cfd_menor, obs
from sgs';

$sql = 'select code,sum(no_cfd_mayor) as no_cfd_mayor, sum(no_cfd_menor) as no_cfd_menor, sum(obs) as obs
from
(' . $string . ') t
group by code;';

$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

while($row = mysqli_fetch_array($result)) 
{ 	    
    $code=$row['code'];
    $no_cfd_mayor=$row['no_cfd_mayor'];
    $no_cfd_menor=$row['no_cfd_menor'];
    $obs=$row['obs'];    

    $Data[] = array(
                            'code'=>$code,
                            'no_cfd_mayor'=>$no_cfd_mayor,
                            'no_cfd_menor'=>$no_cfd_menor,
                            'obs'=>$obs
                        );
}

mysqli_free_result($result);

for ($i=0; $i < sizeof($Data) ; $i++) { 
    $code = $Data[$i]['code'];
    $sql = "select nota, fecha from nota_auditoria where code = '".$code."';";
    $result = mysqli_query($con,$sql);
    if (!$result) {
        printf("Error message: %s\n", mysqli_error($con));
    }

    $row_count = mysqli_num_rows( $result );
    
    if($row_count == 1){
        $row = mysqli_fetch_assoc($result);
        $Data[$i]['fecha'] = $row['fecha'];
        $Data[$i]['nota'] = $row['nota'];
    } else {
        $Data[$i]['fecha'] = '';
        $Data[$i]['nota'] = 0;
    }

    mysqli_free_result($result);
}

close_conection($con);

$json_string = json_encode($Data);

echo $json_string;
?>