<?php
class git {
	public $name;
	public $description;
}

$q = strip_tags($_GET['q']);
$q = str_replace(",", "", $q);

$git= new git;
$git->id = "*";
$git->adescription = "<span class=\"strong\">{$q}</span> in <em>All repositories</em>";
$git->description = "{$q} in <em>All services</em>";

$git1 = new git;
$git1->id = "ht";
$git1->adescription = "<span class=\"koko\">{$q}</span> in <em>Hairdressing Training</em>";
$git1->description = "<span class=\"strong\">{$q}</span> in <em>Hairdressing Training</em>";

$git2 = new git;
$git2->id = "jorum";
$git2->adescription = "<span class=\"strong\">{$q}</span> in <em>Jorum</em>";
$git2->description = "<span class=\"strong\">{$q}</span> in <em>Jorum</em>";

$git3 = new git;
$git3->id = "mediahub";
$git3->adescription = "<span class=\"strong\">{$q}</span> in <em>Mediahub</em>";
$git3->description = "<span class=\"strong\">{$q}</span> in <em>Mediahub</em>";

$x = array(
		'items'=>[
		$git,
		$git1,
		$git2,
		$git3
		]
	);

echo(json_encode($x));