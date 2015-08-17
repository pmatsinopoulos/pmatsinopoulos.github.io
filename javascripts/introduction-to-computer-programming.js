$(document).ready(function(){
    $('#scheduled-classes-notify-me-form').on('submit', function() {
        var name_value  = $(this).find("input[name='name']").val();
        var email_value = $(this).find("input[name='email']").val();

        if (name_value.trim() == '') {
            alert('You have to give a name!');
            return false;
        }

        if (email_value.trim() == '') {
            alert('You have to give an email!');
            return false;
        }

        return true;
    });
});