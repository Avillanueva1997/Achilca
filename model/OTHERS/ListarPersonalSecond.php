<?php

require_once('../../security.php');
require '../DatosBD.php';


$type = $_POST['_type'];

$sql = "select t1.name, t2.position, t3.area
from staff t1
inner join positions t2 on t1.position = t2.code
inner join areas t3 on t1.area = t3.code
where t1.type = '".$type."';";

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");


$result = mysqli_query($con,$sql);

$Staff = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    $name=$row['name'];
    $position=$row['position'];
    $area=$row['area'];

    $Staff[] = array(
    						'name'=>$name,
    						'position'=>$position,
    						'area'=>$area
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($Staff);

echo $json_string;
?>