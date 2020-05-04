<?php

require_once('../../security.php');
require '../DatosBD.php';

$_Title = $_POST['_Title'];
$_Title = mb_strtoupper($_Title);
$_Siglas = $_POST['_Siglas'];
$_Siglas = strtolower($_Siglas);

$sql = "create table {$_Siglas}(
    code varchar(18) not null primary key,
    no_cfd_mayor smallint,
    no_cfd_menor smallint,
    obs smallint);";

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");



$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

mysqli_free_result($result);

$newView = 'sig01-' . $_Siglas;
$_Siglas = strtoupper($_Siglas);

$sql = "insert into nodos(title, info, [view], level) values('".$_Title."', '".$_Siglas."', '".$newView."','HOMESIG');";

$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

mysqli_free_result($result);

close_conection($con);

echo 1;

?>