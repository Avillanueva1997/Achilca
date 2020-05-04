<?php

require_once('../../security.php');
require '../DatosBD.php';

$_Usuario = $_POST['_Usuario'];
$_Password = $_POST['_Password'];

$sql = "select t1.email, t1.name, t1.lastname, t1.area, t2.description as role 
		from users t1 
		inner join roles t2 on t1.role = t2.code
		where t1.email = '" . $_Usuario . "' and t1.password = '" . $_Password . "';";

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");
$result = mysqli_query($con,$sql);


if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$row_count = 0;

$data = array();

if (mysqli_num_rows($result) != 0) {
	$row_count = mysqli_num_rows( $result );
	if($row_count == 1){
		$row = mysqli_fetch_assoc($result);
		$data[] = array(
			'email' => $row['email'],
			'name' => $row['name'],
			'lastname' => $row['lastname'],
			'area' => $row['area'],
			'role' => $row['role']
		);
		//echo 1;
	}
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($data);

echo $json_string;

?>