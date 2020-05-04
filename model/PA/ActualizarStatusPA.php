<?php

require_once('../../security.php');
require '../DatosBD.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$_Code = $_POST['_Code'];
$_CodeCab = $_POST['_CodeCab'];
$_Table = $_POST['_Table'];

$sql = "update {$_Table} set status = '2' where code = '".$_Code."' and code_cab = '".$_CodeCab."';";

$result = mysqli_query($con,$sql);

if (!$result ) {
    printf("Error message: %s\n", mysqli_error($con));
}

close_conection($con);

echo $result;

?>