const $btnIniciarSesion= document.querySelector('.iniciar-sesion'),
      $btnRegistrarse = document.querySelector('.registrarse'),  
      $registrarse = document.querySelector('.formulario2'),
      $iniciarSesion  = document.querySelector('.formulario1');

document.addEventListener('click', e => {
    if (e.target === $btnIniciarSesion || e.target === $btnRegistrarse) {
        $iniciarSesion.classList.toggle('active');
        $registrarse.classList.toggle('active')
    }
});