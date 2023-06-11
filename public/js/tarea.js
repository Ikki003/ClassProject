    movedElement = null;
    tarea = null;
    url_update = "";
    auth_user = null;

    function openPopup(este) {
        let id_tarea = $(este).data('id');
        let id_proyecto = $(este).data('id2');

        let url = $(este).find("[name='url_edit']").val();
        url_update = $(este).find("[name='url_update']").val();

        $.ajax({
            type: "GET",
            url: url,
            data: id_tarea,
            success: function(data){

            if(data['tarea']) {
                $('#popup').removeClass('hidden');

                tarea = data['tarea'];

                setAction();
                fillInputs();
                handleOptions(tarea.estado_id, tarea.prioridad_id);
            }
            },
            error: function(){

            }
        });
    }

    function openCreate(estado_id) {
        $('#popup').removeClass('hidden');
        $("#name_title").text('Crear nueva tarea')

        handleOptions(estado_id);
    }

    function closeModal() {
        $('#popup').addClass('hidden');
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

        url_update = movedElement.children().val();
        let token = movedElement.children().attr('token');


        // url = "{{ route('tarea.update', ['tarea' => ':task_id']) }}";
        // url = url.replace(':task_id', task_id);

        // console.log(url);
        // debugger;

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

    function allowDrop(ev) {
        ev.preventDefault();
    }

    function setAction() {
        $('#updateTask').attr('action', url_update);
    }

    function fillInputs() {
        $("#name").val(tarea.name);
        $("#name_title").text(tarea.name);
        $("#description").val(tarea.description);
    }

    function handleOptions(estado_id, prioridad_id = null) {
        let options_state = $("[name=state_option]");
        let options_priority = $("[name=priority_option]");

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
    }

    $(document).ready(() => {
        $("#newmember").click(() => {
            $("#popup2").removeClass('hidden');
            auth_user = $("#auth_user").val();
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
                        "   <button type='text' class='bg-blue-500 text-white active:bg-blue-800 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ml-4 ease-linear transition-all duration-150' id='request_user'> Mandar Solicitud</button>\n" +
                        "  </div>\n" +
                        "  <input type='hidden' value=':user_id' id='user_id'\n" +
                        "  <input type='hidden' value='{{ route('notification.sendNotification') }} id='url_send_notification'\n" +
                        "  <input type='hidden' value='{{ csrf_token() }} id='token_send_notification'\n";

                        html = html.replace(':nombre', user.name).replace(':correo', user.email).replace(':user_id', user.id);

                        $("#userlist").append(html);
                    })
                },
            });
        })

        $("#request_user").click((e) => {

            let url_send_notification = $("#url_send_notification").val();
            let token = $("#token_send_notification").val();
            let user_receptor = $("#user_id").val();

            console.log(url_send_notification, token, user_receptor);
            $.ajax({
                type: "POST",
                url: url_send_notification,
                data: {
                    'modo' : 'joinproject',
                    'user_receptor' : user_receptor,
                    'auth_user' : auth_user,
                    '_token': token,
                },
                success: function(data){
                
                    if(data['ok'] == true) {
                        location.reload();
                    }
    
                },
            });
        })
    });