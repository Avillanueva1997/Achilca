<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require '../Global_Functions.php';
require '../vendor/autoload.php';
require_once('../../security.php');
require '../DatosBD.php';

$_Code = $_POST['_Code'];
$_Title = $_POST['_Title'];
$_Table = $_POST['_Table'];
$_User = $_POST['_User'];

$sql = "select t1.code, t1.actividad, t1.fecha_eje, t2.area, t3.name, t3.lastname, t3.email, t1.date_create, t1.user
from {$_Table} t1
inner join areas t2 on t1.area_res = t2.code
inner join users t3 on t1.persona_res = t3.code
where t1.code = '".$_Code."';";

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$Data = array();

$row_count = mysqli_num_rows( $result );
if($row_count == 1){
    $row = mysqli_fetch_assoc($result);
    $Data[] = array(
        'code' => $row['code'],
        'actividad' => $row['actividad'],
        'fecha_eje' => $row['fecha_eje'],
        'area' => $row['area'],
        'name' => $row['name'],
        'lastname' => $row['lastname'],
        'email' => $row['email'],
        'date_create' => $row['date_create'],
        'user' => $row['user']
    );

    mysqli_free_result($result);
}

$Data = $Data[0];
$code = $Data['code'];
$actividad = $Data['actividad'];
$fecha_eje = $Data['fecha_eje'];
$fecha_eje = explode('-', $fecha_eje);
$fecha_eje = $fecha_eje[2].'/'.$fecha_eje[1].'/'.$fecha_eje[0];
$area = $Data['area'];
$name = $Data['name'];
$lastname = $Data['lastname'];
$email = $Data['email'];
$date_create = $Data['date_create'];
$date_create = explode(" ", $date_create);
$fecha = $date_create[0];
$fecha = explode('-', $fecha);
$fecha = $fecha[2].'/'.$fecha[1].'/'.$fecha[0];
$hour = $date_create[1];
$user = $Data['user'];

$message = "<html>
<head>
<style>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}

.foot { display: inline-block; line-height: 70px; vertical-align: top }

.img { display: inline-block;  }

</style>
</head>
<body>

<br>

<h4>Estimado,</h4>
<p>Se ha actualizado la actividad por el usuario: {$_User}.</p>

<table>
  <tr>
    <th>Área</th>
    <td>{$_Title}</td>
  </tr>
  <tr>
    <th>Código</th>
    <td>{$code}</td>
  </tr>
  <tr>
    <th>Actividad</th>
    <td>{$actividad}</td>
  </tr>
  <tr>
    <th>Fecha Ejecución</th>
    <td>{$fecha_eje}</td>
  </tr>
  <tr>
    <th>Área Responsable</th>
    <td>{$area}</td>
  </tr>
  <tr>
    <th>Persona Responsable</th>
    <td>{$lastname}, {$name}</td>
  </tr>
  <tr>
    <th>Fecha de Creación</th>
    <td>{$fecha}</td>
  </tr>
  <tr>
    <th>Hora de Creación</th>
    <td>{$hour}</td>
  </tr>
</table>
<hr>
<div class='siteFooterBar'>
    <div class='content'>
    <a href='https://www.aceroschilca.com'><img src='cid:mepsa_ac_1' alt='Mepsa - Aceros Chilca'></a>
    <div class='foot'><b>© 2020 MEPSA / ACEROS CHILCA</b> - Todos los Derechos Reservados.</div>
    </div>
</div>

</body>
</html>
";

$mail = new PHPMailer();
$mail->CharSet = "UTF-8";
$mail->isSMTP();
$mail->Host       = 'ssl://smtp.gmail.com'; 
$mail->SMTPAuth   = true;
$mail->Username   = 'serviciosti.ach@gmail.com';
$mail->Password   = 'lhglorhiomfwzlhz';         
$mail->Port       = 465 ;           
$mail->SMTPSecure = 'ssl';

$mail->AddEmbeddedImage('../../assets/images/mepsa_ac.png', 'mepsa_ac_1');

$mail->setFrom('serviciosti.ach@gmail.com', 'Servicios TI');
$mail->addAddress($user);
$mail->addAddress($email);

$mail->isHTML(true);
$mail->Subject = 'Actividad actualizada: #'.$code;
$mail->Body    = $message;

if (!$mail->send()){
   echo $mail->ErrorInfo;
} else {
    echo 1;
}

?>