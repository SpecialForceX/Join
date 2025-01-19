function showPassword(event) {
    let icon = event.target;
    let input = icon.parentElement.parentElement.querySelector('input');

    if (input.type == 'password') {
        input.type = 'text'
        icon.src = '../assets/img/visibility.svg';
    } else {
        input.type = 'password'
        icon.src = '../assets/img/visibility_off.svg';
    }
}