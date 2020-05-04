<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require '../Global_Functions.php';
require '../vendor/autoload.php';
require_once('../../security.php');
require '../DatosBD.php';

$day = date('d');
$month = date('m');
$year = date('Y');
$dateString = $day.'/'.$month.'/'.$year;

$sql = "select t1.email, t2.name, t2.lastname from destinatarios_rp t1 inner join users t2 on t1.user = t2.code;";
$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$Data = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    $email=$row['email'];
    $name=$row['name'];
    $lastname=$row['lastname'];

    $Data[] = array(
    						'email'=>$email,
    						'name'=>$lastname.', '.$name
    					 );
}

mysqli_free_result($result);

$data = substr($_POST['data'], strpos($_POST['data'], ",") + 1);
$decodedData = base64_decode($data);
$filename = $_POST['fname'];
$fp = fopen($filename, 'wb');
fwrite($fp, $decodedData);
fclose($fp);

/*$message = '<p>Estimados,</p>';
$message .= '<p>Se ha generado el siguiente reporte de producción.</p>';
$message .= '<div><center><a href="https://www.aceroschilca.com/"><img style="width:350px; height:auto; margin-bottom:25px;" src="cid:mepsa_ac_1" alt="Mepsa - Aceros Chilca" /></a></center></div>';*/

$message = "<html>
<head>
<style>
.foot { display: inline-block; line-height: 70px; vertical-align: top }

.img { display: inline-block;  }

</style>
</head>
<body>

<br>

<h4>Estimados,</h4>
<p>Se adjunta el reporte de turno {$dateString}</p>

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

//$mail->SMTPDebug = SMTP::DEBUG_SERVER;                      // Enable verbose debug output
//$mail->SMTPDebug = 2;
//$mail->Debugoutput = 'html';
$mail->isSMTP();                                            // Send using SMTP
$mail->Host       = 'ssl://smtp.gmail.com'; 
//$mail->Host       = 'tls://smtp.office365.com';                    // Set the SMTP server to send through
$mail->SMTPAuth   = true;                                   // Enable SMTP authentication
//$mail->Username   = 'villanuevaangel97@outlook.com';                     // SMTP username   
$mail->Username   = 'serviciosti.ach@gmail.com'; 
$mail->Password   = 'lhglorhiomfwzlhz';      
//$mail->Password   = 'tkuuwtjtyavzchlw';
//$mail->Password   = 'Staystrong:)';
//$mail->Password   = 'tkuuwtjtyavzchlw';
//$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;         // Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` encouraged
$mail->Port       = 465 ;       
//$mail->Port       = 587 ;       
$mail->SMTPSecure = 'ssl';
//$mail->SMTPSecure = 'tls';

$mail->AddEmbeddedImage('../../assets/images/mepsa_ac.png', 'mepsa_ac_1');

//Recipients
$mail->setFrom('serviciosti.ach@gmail.com', 'Servicios TI');
//$mail->setFrom('villanuevaangel97@outlook.com', 'Angel David Villanueva Cajas');

for ($i=0; $i < sizeof($Data); $i++) {
    $mail->addAddress($Data[$i]['email'], $Data[$i]['name']);
}
//$mail->addAddress('villanuevaangel68@gmail.com', 'Angel David Villanueva Cajas');
//$mail->addAddress('villanuevaangel97@outlook.com', 'Angel David Villanueva Cajas');

$mail->addAttachment($filename); 

// Content
$mail->isHTML(true);                                  // Set email format to HTML
$mail->Subject = 'Reporte de Turno: '.$dateString;;
$mail->Body    = $message;

if (!$mail->send()){
   echo $mail->ErrorInfo;
} else {
    unlink($filename);
    echo 1;
}

?>