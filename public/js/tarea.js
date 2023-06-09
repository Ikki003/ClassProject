    movedElement = null;
    tarea = null;
    url_update = "";
    url_create = "";
    auth_user = null;
    proyecto_id_join = null;
    id_tarea = null;
    proyecto_id = null;
    error_message = "";
    error_output = false;
    enabled = false;
    form = null

    function openPopup(este) {
        // tarea = $(este).data('tarea');
        // let id_proyecto = $(este).data('id2');

        var url_edit_task = $(este).find('[name="url_edit"]').val();

        let project_admin = $(este).find('[name="user_admin"]').val();
        let logged_user = $(este).find('[name="user_admin"]').data('logged');

        $.ajax({
            type: "GET",
            url: url_edit_task,
            success: function(data){

            if(data['tarea']) {
                // $('#contenedor').html(data);
                $('#popup').removeClass('hidden');
                // $('#popup').removeClass('hidden');

                if(project_admin == logged_user) {
                    $("#delete_task_button").removeClass('hidden');
                }

                $("[name=options_users]").click((event) => {
                    let value_option = $(event.target).data('value');
                    $("#responsable_id").val(value_option);
                    $("#dropdown2").addClass('hidden');
                })

                tarea = data['tarea'];

                id_tarea = tarea.id;
                
                proyecto_id = data['proyecto_id'];
                
                $("#tarea_id").val(id_tarea);

                url_update = "/proyectos/:proyecto_id/tareas/:tarea_id";
                url_update = url_update.replace(':proyecto_id', proyecto_id).replace(':tarea_id', id_tarea);

                setAction(url_update);
                form = $("#create_update_task");
                // setMethod("POST")
                fillInputs();
                handleOptions(tarea.estado_id, tarea.prioridad_id, tarea.responsable_id);

            }
            },
            error: function(){

            },

        });

        $("[name=register_time]").click(() => {
            $("#popup3").removeClass('hidden');
            $("#assigned_time").text("Tiempo asignado: "+tarea.hours);

            if(tarea.estimated_hours == null) {
                $("#estimated_time").text("Tiempo estimado: No se ha estimado");
            } else {
                $("#estimated_time").text("Tiempo estimado: "+tarea.estimated_hours);
            }
            
        });

    }

    $("#delete_task_button").click(() => {
        $("#delete_task_form").attr('action', "tareas/"+id_tarea);
    })

    function handleTime() {

        let hours = $("#hours").val();
        let estimated_hours = $("#estimated_hours").val();

        if(enabled && estimated_hours.length === 0) {
            $("#error_hours").text("No has introducido horas estimadas");
            $("#hours").val('');
            $("#estimated_hours").val('');
            enabled = false;
            $("#estimated_hours").addClass('bg-gray-200');
            $("#estimated_hours").prop('disabled', true);
            return;
        }

        validatorDateInput(hours, true);
        validatorDateInput(estimated_hours, false);

        if(error_output) {
            $("#error_hours").text(error_message);
            $("#hours").val('');
            $("#estimated_hours").val('');
            error_output = false;
            error_message = "";
            return;
        }

        let url_set_time = "/proyectos/"+proyecto_id+"/tareas/"+id_tarea+"/settime";
        $("#set_time_form").attr('action', url_set_time);


        $form = $("#set_time_form");
        $form.submit();

    }

    function validatorDateInput(date, is_hours) {
        let date_string = date;

        if(!date && is_hours) {
            error_message = "Añade un tiempo para guardar.";
            error_output = true;
            return;
        }

        let pattern = /^(?:(?:\d+h)?(?:\d+m)?)?$/;


        // $("#hours").val(tarea['hours']);

        var regex = /(\d+)h(\d+)m/;
        var match = regex.exec(date);

        let hoursString = '';
        let minutesString = '';

        if (match) {
            hoursString = match[1];
            minutesString = match[2];

            hours = parseInt(hoursString);
            minutes = parseInt(minutesString);

            if(minutes>60) {
                error_message = "Los minutos no pueden superar los 60; añade más horas.";
                error_output = true;
                return;
            }
        }

        if(hours>99) {
            error_message = "Las horas no pueden superar las 99.";
            error_output = true;
            return;
        }

        if(!(date_string.match(pattern))) {
            error_message = "Asegúrate de meter la hora con formato 2h2m.";
            error_output = true;
            return;
        }
    }

    function submitUpdate() {
        form.submit();
    }

    // function submitPopUp() {
    //     $form = $("#create_update_task");

    //     console.log($form);
    //     debugger;
    // }

    function openCreate(estado_id) {
        $('#popup').removeClass('hidden');
        $("#name_title").text('Crear nueva tarea');
        $("#registrar_tiempo_button").addClass('hidden');
        url_create = $("#task_create").val();

        setAction(url_create);
        form = $("#create_update_task");
        // setMethod("POST")
        handleOptions(estado_id);

    //    $("[name=register_time]").click(() => {          
    //         $("#popup3").removeClass('hidden');
    //         $("#popup3").find("#registrar_tiempo").addClass('hidden');
    //         $("#popup3").find("#estimated_hours").removeClass('bg-gray-200');
    //         $("#popup3").find("#estimated_hours").prop('disabled', false);
    //     });
    }

    function closeModal(id_modal) {

        let modal = $("" + '#' + id_modal + "");
        modal.addClass('hidden');

        if(id_modal == 'popup3') {
            $("#hours").val('');
            return;
        }

        location.reload();
    }

    function drag(ev) {
        movedElement = $(ev.target);
    }

    function drop(ev) {
        ev.preventDefault();

        let target = $(ev.target);

        if(target.attr('name') == 'state') {
            target.append(movedElement)
        } else {

            while(!(target.attr('name') == 'state')) {
                target = target.parent();
            }

            target.append(movedElement);

        }

        let state_id = target.data('id');
        let task_id = movedElement.data('id');

        url_update = $("[name=url_update]").val();
        let token = $("[name=url_update]").attr('token');

        $.ajax({
            type: "PUT",
            url: url_update,
            data: {
                'modo' : 'ondrop',
                'task_id' : task_id,
                'state_id' : state_id,
                '_token': token,
            },
            success: function(data){
            
                if(data['ok'] == true) {
                    location.reload();
                }

            },
        });
    }

    // function submitForm(e) {
    //     e.preventDefault();

    //     $form = $("#create_update_task");

    //     $form.submit();
    // }

    function allowDrop(ev) {
        ev.preventDefault();
    }

    function setAction(url) {
        $('#create_update_task').attr('action', url);
    }

    // function setMethod(method) {
    //     $('#create_update_task').attr('method', method);
    //     $("[name=_method]").val(method);
    // }

    function fillInputs() {
        $("#name").val(tarea.name);
        $("#name_title").text(tarea.name);
        $("#description").val(tarea.description);
        $("[name=start_date]").val(tarea.start_date);
        $("[name=end_date]").val(tarea.end_date);
    }

    function handleOptions(estado_id, prioridad_id = null, responsable_id) {

        let options_state = $("[name=state_option]");
        let options_priority = $("[name=priority_option]");
        let options_users = $("[name=options_users]");

        options_state.each((index, element) => {
            let currentValue = $(element).val();
            
            if (currentValue == estado_id) {
                $(element).attr('selected', true);
                return; // Sale del bucle forEach
            }
        });

        options_priority.each((index, element) => {
            let currentValue = $(element).val();
            
            if (currentValue == prioridad_id) {
                $(element).attr('selected', true);
                return; // Sale del bucle forEach
            }
        });

        options_users.each((index, element) => {
 
            let currentValue = $(element).data('value');
            
            if (currentValue == responsable_id) {
                $("#badge_user_"+currentValue).removeClass('hidden');
                $("#responsable_id").val(currentValue);
                return; // Sale del bucle forEach
            }
        });
    }

    function enableInput() {
        $("#estimated_hours").removeClass('bg-gray-200');
        $("#estimated_hours").prop('disabled', false);
        enabled = true;
    }

    $(document).ready(() => {
        $("#newmember").click(() => {
            $("#popup2").removeClass('hidden');
            $("#user_name").focus();
            auth_user = $("#auth_user").val();
            proyecto_id_join = $("#proyecto_id_join").val();
        })

        $("#search_user").click((e) => {
            e.preventDefault();

            let url_users = $("#url_users").val();
            let name = $("#user_name").val();

            // console.log($("#userlist").children());
            // debugger;

            if($("#userlist").children().length !== 0) {
                $("#userlist").empty();
            }
            
            if(!name) {
                let error = "El campo es obligatorio"
                $("#error").text(error);
                return;
            }

            let token = $("#token_users").val();

            $.ajax({
                type: "GET",
                url: url_users,
                data: {
                    'name' : name,
                    '_token': token,
                },
                success: function(data){

                    $("#user_name").val('');

                    let users = data.users; 

                    if(users.length === 0) {
                        let error = "No se han encontrado registros. Busca por otro nombre."
                        $("#error").text(error);
                        return;
                    }
                
                    $.each(users, (index, user) => {
                        let html = "<div class='ml-4 mt-3 flex items-center mb-4'>\n" +
                        "  <div class='flex flex-row items-center'>\n" +
                        "    <img class='w-10 h-10 mr-3 rounded-full ml-3' src='https://randomuser.me/api/portraits/lego/7.jpg' alt='' />\n" +
                        "    <div class='flex flex-col'>\n" +
                        "      <p class='font-semibold text-gray-800'> :nombre </p>\n" +
                        "      <p class='text-gray-400'> :correo </p>\n" +
                        "    </div>\n" +
                        "  </div>\n" +
                        "   <button type='text' class='bg-blue-500 text-white active:bg-blue-800 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ml-4 ease-linear transition-all duration-150' data-id=':user_id' name='request_user'> Mandar Solicitud</button>\n" +
                        "  </div>\n";

                        html = html.replace(':nombre', user.name)
                            .replace(':correo', user.email)
                            .replace(':user_id', user.id)

                        $("#userlist").append(html);
                    })
                },
            });
        })

        $(document).on("click", "#userlist", function(event) {
            if ($(event.target).is("[name=request_user]")) {
                let component = $(event.target);
                $(component).text("Notificación enviada");
                $(component).addClass("bg-gray-500");
                $(component).prop('disabled', true);
                let url_send_notification = $("[name=url_send_notification]").val();
                let token = $("[name=token_send_notification]").val();
                let user_receptor = $(component).data('id');

                $.ajax({
                    type: "POST",
                    url: url_send_notification,
                    data: {
                        'modo' : 'joinproject',
                        'user_receptor' : user_receptor,
                        'auth_user' : auth_user,
                        'proyecto_id_join' : proyecto_id_join,
                        '_token': token,
                    },
                    success: function(data){
                    
                        if(data['error']){
                            $("#error").text(data['error']);
                            $(component).text("Mandar Solicitud");
                            return;
                        }
        
                    },
                });
            }
        });
    });