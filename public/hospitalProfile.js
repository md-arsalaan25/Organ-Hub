

function myFunction() {
    var element = document.getElementById("home-tab");
    // element.classList.add("nav-link");
    element.classList.remove("active");
    element.setAttribute("aria-selected","false");

    var elem=document.getElementById("profile-tab");
    elem.classList.add("active");
    elem.setAttribute("aria-selected","true");

    var ele=document.getElementById("home");
    ele.classList.remove("show","active");

    var el=document.getElementById("profile");
    el.classList.add("show","active");
  }

  function myFunction2() {
    var element = document.getElementById("home-tab");
    // element.classList.add("nav-link");
    element.classList.add("active");
    element.setAttribute("aria-selected","true");

    var elem=document.getElementById("profile-tab");
    elem.classList.remove("active");
    elem.setAttribute("aria-selected","false");

    var ele=document.getElementById("home");
    ele.classList.add("show","active");

    var el=document.getElementById("profile");
    el.classList.remove("show","active");
  }

