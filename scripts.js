
function showChapter() {
	document.getElementById("verse").innerHTML = "Luke 6:31";
}
function showVerse() {
	document.getElementById("verse").innerHTML = "Treat others the same way you want them to treat you.";
}

/* *** The Social *** */
function showSocialIcon() {
	document.getElementById("word-social").style.visibility = "hidden";
	document.getElementById("image-row-social").style.visibility = "visible";
	document.getElementById("line-social").style.backgroundImage = 'url("images/line_purple.png")';
}
function showSocialWord() {
	document.getElementById("word-social").style.visibility = "visible";
	document.getElementById("image-row-social").style.visibility = "hidden";
	document.getElementById("line-social").style.backgroundImage = 'url("images/line_gray.png")';
}
function showDescriptionSocial(name) {
	var descBox = document.getElementById("description-social");
	descBox.innerHTML = name;
}
function hideDescriptionSocial() {
	var descBox = document.getElementById("description-social");
	descBox.innerHTML = "";
}

/* *** The Professional *** */
function showDescriptionProfessional(name) {
	var descBox = document.getElementById("description-professional");
	descBox.innerHTML = name;
}
function hideDescriptionProfessional() {
	var descBox = document.getElementById("description-professional");
	descBox.innerHTML = "";
}
function showProfessionalIcon() {
	document.getElementById("word-professional").style.visibility = "hidden";
	document.getElementById("image-row-professional").style.visibility = "visible";
	document.getElementById("line-professional").style.backgroundImage = 'url("images/line_purple.png")';
}
function showProfessionalWord() {
	document.getElementById("word-professional").style.visibility = "visible";
	document.getElementById("image-row-professional").style.visibility = "hidden";
	document.getElementById("line-professional").style.backgroundImage = 'url("images/line_gray.png")';
}


/* *** The Personal *** */
function showDescriptionPersonal(name) {
	var descBox = document.getElementById("description-personal");
	descBox.innerHTML = name;
}
function hideDescriptionPersonal() {
	var descBox = document.getElementById("description-personal");
	descBox.innerHTML = "";
}
function showPersonalIcon() {
	document.getElementById("word-personal").style.visibility = "hidden";
	document.getElementById("image-row-personal").style.visibility = "visible";
	document.getElementById("line-personal").style.backgroundImage = 'url("images/line_purple.png")';
}
function showPersonalWord() {
	document.getElementById("word-personal").style.visibility = "visible";
	document.getElementById("image-row-personal").style.visibility = "hidden";
	document.getElementById("line-personal").style.backgroundImage = 'url("images/line_gray.png")';
}