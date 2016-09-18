$(document).ready(function(){
    genIconZa();
    genIconBlood();
    genIconHabit();
    $(".japan_content").JVFurigana();
    $(document).on('click','button.icon',function () {

        var word = $(this).data('word');
        if($(this).hasClass('iconblood')){
        $('#blood_zone').text(word);
        } else if($(this).hasClass('iconza')){
        $('#za_zone').text(word);
        } else if($(this).hasClass('iconhabit')){
            $('#habit_zone').text(word).JVFurigana();
        }
        var para = {pitch: 1, rate: 1,volume: 1};
	    responsiveVoice.speak(word.replace(/ *\（[^）]*\） */g, ""), "Japanese Female");

        //$('#newsframe').contents().find('textarea[name="sample_text"]').prop('value',word);
        //$('#newsframe').contents().find('#btn-normal')[0].click();
        //$('textarea[name="sample_text"]').prop('value',word);
        //$('#btn-normal')[0].click();
    });
    $(document).on('click','.btn_playword',function () {
        var word = ''; 
        $(this).prev().contents().each(function(){
            if($(this).is('ruby')){
                word += $(this).find('rt').text();
            } else{
                if($(this).find('rt').length!=0){
                    word += $(this).find('rt').text();
                } else {
                    word += $(this).text();
                }
            }
        });
        //responsiveVoice.speak(word.replace(/ *\（[^）]*\） */g, ""), "Japanese Female");
        responsiveVoice.speak(word, "Japanese Female");
    });
});
var word = ""
function genIconZa(){
    var data='おひつじ座,おうし座,ふたご座,かに座,しし座,おとめ座,てんびん座,さそり座,いて座,やぎ座,みずがめ座,うお座';
    var data_list = data.split(',');
    var content_obj = $('#iconza_zone');
    for(var i = 0 ; i < 3; i++){
        for(var j=0 ; j < 4; j++){
            var icon = '<button class="icon iconza" style="background-position-x: '+(0-j*125)+'px; background-position-y: '+(0-i*125)+'px;" data-word="'+data_list[i*4+j]+'"></button>';
            var div = '<div class="col-xs-6 col-sm-4 col-md-3 col-lg-2 form-inline">'+icon+'</div>';
            content_obj.append(div);
        }
    }
}
function genIconBlood(){
    var data='A,B,O,AB';
    var data_list = data.split(',');
    var content_obj = $('#iconblood_zone');
    for(var i = 0 ; i < 2; i++){
        for(var j=0 ; j < data_list.length; j++){
            var icon = '<button class="icon iconblood '+data_list[j].toLowerCase()+(i==0?'female':'male')+' " data-word="'+data_list[j]+'"></button>';
            var div = '<div class="col-xs-6 col-sm-4 col-md-3 col-lg-2 form-inline">'+icon+'</div>';
            content_obj.append(div);
        }
        content_obj.append('<div class="col-lg-12"></div>');
    }
}
function genIconHabit(){
    var data='水（すい）泳（えい）,サッカー,バレーボール,野（や）球（きゅう）,ピンポン,料（りょう）理（り）,ピアノ,カラオケ,ゲーム,読（どく）書（しょ）,音（おん）楽（がく）,映（えい）画（が）,インターネット,散（さん）歩（ぽ）';
    var icon='swim,soccer,volleyball,baseball,tabletennis,cooking,piano,karaok,game,read,music,movie,internet,walk';
    //var sound_text = data.replace(/ *\([^)]*\) */g, "");
    var data_list = data.split(',');
    var icon_list = icon.split(',');
    //var sound_text_list = sound_text.split(',');
    var content_obj = $('#iconhabit_zone');
    for(var j=0 ; j < data_list.length; j++){
        var icon = '<button class="icon iconhabit icon'+icon_list[j]+'" data-word="'+data_list[j]+'"></button>';
        var div = '<div class="col-xs-6 col-sm-4 col-md-3 col-lg-2 form-inline">'+icon+'</div>';
        content_obj.append(div);
    }
}
