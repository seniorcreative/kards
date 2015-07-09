var gender = 'male',age = 75,checks = [], firstname='';

function buildOutput()
{


    gender = $('input[name="gender"]:checked').val();
    age = parseInt($('input[name="age"]').val());
    firstname = $('input[name="firstname"]').val();

    checks = []

    switch(gender)
    {

        case 'male':

            if (age > 18)
            {

                checks.push('males please check [THIS] as aged over 18');

            }

            if (age > 45)
            {

                checks.push('males please check [THIS] as aged over 45');

            }

            if (age >= 50)
            {

                checks.push('Colonoscopy every 5 years');

            }

            if (age > 60)
            {

                checks.push('males please check [THIS] as aged over 60');

            }

            break;

        case 'female':


            // range

            if (age >= 50  && age <= 74 )
            {

                checks.push('Mammogram screening every 5 years');

            }


            break;

    }


    var output = '';

    for(var c in checks)
    {

        var prefix = (firstname != '') ? firstname + ', you need a ' : '';
        output += prefix + checks[c] + '\n';



    }

    $('#outcome').html(output);

}

$(document).ready(function(){

    $('input[name="gender"]').on('change', buildOutput);
    $('input[name="age"]').on('change', buildOutput);
    $('input[name="firstname"]').on('change', buildOutput);
    buildOutput();

});