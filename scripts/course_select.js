var item_text = '単語（たんご）,文型（ぶんけい）,例文（れいぶん）,会話（かいわ）,問題（もんだい）'.split(',');
var item_list = 'word,type,example,conversation,question'.split(',');
var btn_color_list = 'info,success,warning,primary,danger'.split(',');



$(document).ready(function () {
    initCourse();
    $(document).on('click','button.btn_load_lesson',function () {
    //$('#btn_load_lesson').click(function () {
        var lesson = $(this).data('lesson');
        cleanAudioPlayer();
        onLoadLessonStage($('#input_lesson').prop('value'), lesson);
    });

    $('#uploadFile').change(function () {
        var stage = $('#upload_lesson_stage').prop('value');
        if(stage!=undefined&& stage!=''){
            getAsText($(this)[0].files[0],stage);
        } else{
            alert('請選擇上傳類型');
            $(this).prop('value','');
        }
    });

    $('#uploadAudio').change(function () {
        $('#audioPlayer').prop('src', URL.createObjectURL($(this)[0].files[0]));
    });

    $('#uploadAudio2').change(function () {
        $('#audioPlayer2').prop('src', URL.createObjectURL($(this)[0].files[0]));
    });

    $('#audioPlayer2').on('pause', function () {
        if ($(this)[0].paused) {
            $('#player_time').text($(this)[0].currentTime);
        }
    });

    $('#btn_advence').click(function () {
        if ($('#advence_zone').is(":visible")) {
            $('#advence_zone').hide();
        } else {
            $('#advence_zone').show();
        }
    });
    
    $('label.btn_radio').on('click',function(){
        $(this).children('input:radio').prop('checked',true);
    });

    $(document).on('click','button.btn_playword',function () {
        var start_sec = $(this).data('start_sec');
        var end_sec = $(this).data('end_sec');
        cleanAudioPlayer();
        var play_times = $('input[name="times_options"]:checked').prop('value');
        playWord(start_sec, end_sec, play_times);
    });
    
});

function initCourse() {
    for (var key in lesson_list) {
        if (lesson_list.hasOwnProperty(key)) {
            var element = lesson_list[key];
            console.log(element);
            $('#input_lesson').append('<option value="' + element + '">' + element + '</option>');
        }
    }
    for (var i = 0; i < item_text.length; i++) {
        $('#lesson_stage_zone').append('<div class="col-xs-4 col-sm-2 col-md-2 col-lg-2 form-inline" style="padding-left: 0px; margin-top: 5px;"><button type="button" class="btn_load_lesson btn btn-block btn-'+btn_color_list[i]+'" data-lesson="'+item_list[i]+'">'+item_text[i].replace(/ *\（[^）]*\） */g, "")+'</button></div>');
    }
    for (var i = 0; i < item_text.length; i++) {
        $('.input_lesson_stage').append('<option value="' + item_list[i] + '">' + item_text[i] + '</option>');
    }
}

function onLoadLessonStage(select_lesson, select_stage) {
    if (select_lesson != '' && select_stage != '') {
        var text_file = './course/' + select_lesson + '_' + select_stage + '.csv';
        var mp3_file = './audio/' + select_lesson + '_' + select_stage + '.mp3';
        $('#audioPlayer').prop('src', mp3_file).get(0).play();
        var audio_obj = $('#audioPlayer').get(0);
        audio_obj.play();
        audio_obj.muted = true;
        audio_obj.oncanplay = function() {
            audio_obj.pause();
            audio_obj.muted = false;
            audio_obj.oncanplay = null;
        };
        getTextFile(text_file, select_stage);
    } else {
        alert('請選擇項目');
    }
}

function show_data(data, stage){
            $('.content_zone').hide();
            if(stage=='word' || stage=='type'){
                show_word(data);
            } else if(stage=='example'){
                show_example(data);
            } else if(stage=='conversation'){
                show_conversation(data);
            } else if(stage=='question'){
                show_question(data);
            }
            $('.'+stage+'_zone').show();
            $(".japan_content").JVFurigana();
}

function getTextFile(file, stage) {
    $.ajax({
        type: "GET",
        url: file,
        dataType: "text",
        success: function (data) {
            var data_list = processData(data);
            show_data(data_list, stage);
        }
    });
}

function transRuby(text){
    var result = text;

    if(result==undefined){
        result = '';
    }
    /*
    var text_list = text.split('））');
    for(var i in text_list){
        var word_split = text_list[i].split('（（');
        if(word_split.length<2){
            result+=word_split[0];    
        } else {
            var tern = word_split[0].split('＠＠');
            result+=tern[0]+'<ruby>'+tern[1]+'<rp>（</rp> <rt>'+word_split[1]+'</rt><rp>）</rp></ruby>';    
        }
    }
    */
    return result;
    
}

function getAsText(fileToRead, stage) {
    var reader = new FileReader();
    // Read file into memory as UTF-8
    reader.readAsText(fileToRead, "UTF-8");
    // Handle errors load
    reader.onload = onLoadHandler;

    function onLoadHandler(evt) {
        var data_list = processData(evt.target.result);
        show_data(data_list, stage);
    };
    reader.onerror = this.errorHandler;
}

function processData(csv) {
    var allTextLines = csv.split(/\r\n|\n/);
    var lines = [];
    for (var i = 0; i < allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        var tarr = [];
        for (var j = 0; j < data.length; j++) {
            tarr.push(data[j]);
        }
        lines.push(tarr);
    }
    return lines;
}

function show_word(data_list) {
    var zone_list_obj = $('.word_list');
    zone_list_obj.html('');
    for (var i = 0; i < data_list.length; i++) {
        var data = data_list[i];

        var play_button_html = '';
        if(data[2]!=undefined&&data[3]!=undefined){
            play_button_html = '<button type="button" class="btn_playword btn-default btn-round" data-start_sec="' + data[3] + '" data-end_sec="' + data[4] + '"><span class="glyphicon glyphicon-play" aria-hidden="true"></span></button>';
        }
        zone_list_obj.append(
            '<tr>' +
            '<td class="japan_content">' + transRuby(data[0]) + '</td>' +
            '<td>' + transRuby(data[1]) + '</td>' +
            '<td>' + transRuby(data[2]) + '</td>' +
            '<td>' + play_button_html + '</td>' +
            '</tr>');
    }
    /*
    $('button.btn_playword').click(function () {
        var start_sec = $(this).data('start_sec');
        var end_sec = $(this).data('end_sec');
        cleanAudioPlayer();
        playWord(start_sec, end_sec, 3);
    });
    */
}

function cleanAudioPlayer(){
        if (timeout_control != null) {
            clearTimeout(timeout_control);
        }
        var player = $('#audioPlayer')[0];
        player.pause();
        player.onplaying = null;
}

function show_example(data_list) {
    var zone_list_obj = $('.example_list');
    zone_list_obj.html('');
    //first line is title of conversation.
    //$('#conversation_title').html(transRuby(data_list[0][0]));
    for (var i = 0; i < data_list.length; i++) {
        var data = data_list[i];
        var play_button_html = '';
        if(data[2]!=undefined && data[3]!=undefined){
            if(data[2]!='' && data[3]!=''){
                play_button_html = '<button type="button" class="btn_playword btn-default btn-round" data-start_sec="' + data[2] + '" data-end_sec="' + data[3] + '"><span class="glyphicon glyphicon-play" aria-hidden="true"></span></button>';
            }
        }
        zone_list_obj.append(
            '<tr>' +
            '<td>' + transRuby(data[0]) + '</td>' +
            '<td class="japan_content">' + transRuby(data[1]) + '</td>' +
            '<td>' + play_button_html + '</td>' +
            '</tr>');
    }
    /*
    $('button.btn_playword').click(function () {
        var start_sec = $(this).data('start_sec');
        var end_sec = $(this).data('end_sec');
        cleanAudioPlayer();
        playWord(start_sec, end_sec, 3);
    });
    */
}


function show_conversation(data_list) {
    var zone_list_obj = $('.conversation_list');
    zone_list_obj.html('');
    //first line is title of conversation.
    $('#conversation_title').html(transRuby(data_list[0][0]));
    for (var i = 1; i < data_list.length; i++) {
        var data = data_list[i];
        var play_button_html = '';
        if(data[2]!=undefined && data[3]!=undefined){
            if(data[2]!=''&&data[3]!=''){
                play_button_html = '<button type="button" class="btn_playword btn-default btn-round" data-start_sec="' + data[2] + '" data-end_sec="' + data[3] + '"><span class="glyphicon glyphicon-play" aria-hidden="true"></span></button>';
            }
        }
        zone_list_obj.append(
            '<tr>' +
            '<td class="japan_content">' + transRuby(data[0]) + '</td>' +
            '<td class="japan_content">' + transRuby(data[1]) + '</td>' +
            '<td>' + play_button_html + '</td>' +
            '</tr>');
    }
    /*
    $('button.btn_playword').click(function () {
        var start_sec = $(this).data('start_sec');
        var end_sec = $(this).data('end_sec');
        cleanAudioPlayer();
        playWord(start_sec, end_sec, 3);
    });
    */
}

function show_question(data_list) {
    var zone_list_obj = $('.question_list');
    zone_list_obj.html('');
    //first line is title of conversation.
    //$('#conversation_title').html(transRuby(data_list[0][0]));
    for (var i = 0; i < data_list.length; i++) {
        var data = data_list[i];
        var play_button_html = '';
        if(data[2]!=undefined && data[3]!=undefined){
            if(data[2]!='' && data[3]!=''){
                play_button_html = '<button type="button" class="btn_playword btn-default btn-round" data-start_sec="' + data[2] + '" data-end_sec="' + data[3] + '"><span class="glyphicon glyphicon-play" aria-hidden="true"></span></button>';
            }
        }
        console.log(data[1]);
        zone_list_obj.append(
            '<tr>' +
            '<td>' + transRuby(data[0]) + '</td>' +
            '<td class="japan_content">' + transRuby(data[1]) + '</td>' +
            '<td>' + play_button_html + '</td>' +
            '</tr>');
    }
    /*
    $('button.btn_playword').click(function () {
        var start_sec = $(this).data('start_sec');
        var end_sec = $(this).data('end_sec');
        cleanAudioPlayer();
        playWord(start_sec, end_sec, 3);
    });
    */
}

var timeout_control = null;
function playWord(start_sec, end_sec, times) {
    var player = $('#audioPlayer')[0];
    player.currentTime = start_sec;
    player.play();
    times--;
    player.onplaying = function () {
        timeout_control = setTimeout(function () {
            player.pause();
            if (times > 0) {
                playWord(start_sec, end_sec, times);
            } else {
                player.onplaying = null;
            }
        }, (end_sec - start_sec) * 1000);
    }
}


