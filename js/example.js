var DAYS_OF_WEEK = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
  NEW_ROW_HOURS = 7;

function print_today() {
  // ***********************************************
  // AUTHOR: WWW.CGISCRIPT.NET, LLC
  // URL: http://www.cgiscript.net
  // Use the script, just leave this message intact.
  // Download your FREE CGI/Perl Scripts today!
  // ( http://www.cgiscript.net/scripts.htm )
  // 
  // Edited by onomatopoetry
  // ***********************************************
  var now = new Date();
  var months = new Array('January','February','March','April','May','June','July','August','September','October','November','December');
  var date = ((now.getDate() < 10) ? "0" : "")+ now.getDate();
  function fourdigits(number) {
    return (number < 1000) ? number + 1900 : number;
  }
  var today =  months[now.getMonth()] + " " + date + ", " + (fourdigits(now.getYear()));
  return today;
}

function shortDate(date) {
  var year = date.getFullYear(),
    month = date.getMonth(),
    dayOfMonth = date.getDate();

  return pad(month + i) + "/" + pad(dayOfMonth) + "/" + year;

  function pad(i) {
    return i > 0 && i < 9 ? "0" + i : i.toString();
  }
}

// from http://www.mediacollege.com/internet/javascript/number/round.html
function roundNumber(number,decimals) {
  var newString;// The new rounded number
  decimals = Number(decimals);
  if (decimals < 1) {
    newString = (Math.round(number)).toString();
  } else {
    var numString = number.toString();
    if (numString.lastIndexOf(".") == -1) {// If there is no decimal point
      numString += ".";// give it one at the end
    }
    var cutoff = numString.lastIndexOf(".") + decimals;// The point at which to truncate the number
    var d1 = Number(numString.substring(cutoff,cutoff+1));// The value of the last decimal place that we'll end up with
    var d2 = Number(numString.substring(cutoff+1,cutoff+2));// The next decimal, after the last one we want
    if (d2 >= 5) {// Do we need to round up at all? If not, the string will just be truncated
      if (d1 == 9 && cutoff > 0) {// If the last digit is 9, find a new cutoff point
        while (cutoff > 0 && (d1 == 9 || isNaN(d1))) {
          if (d1 != ".") {
            cutoff -= 1;
            d1 = Number(numString.substring(cutoff,cutoff+1));
          } else {
            cutoff -= 1;
          }
        }
      }
      d1 += 1;
    } 
    if (d1 == 10) {
      numString = numString.substring(0, numString.lastIndexOf("."));
      var roundedNum = Number(numString) + 1;
      newString = roundedNum.toString() + '.';
    } else {
      newString = numString.substring(0,cutoff) + d1.toString();
    }
  }
  if (newString.lastIndexOf(".") == -1) {// Do this again, to the new string
    newString += ".";
  }
  var decs = (newString.substring(newString.lastIndexOf(".")+1)).length;
  for(var i=0;i<decimals-decs;i++) newString += "0";
  //var newNumber = Number(newString);// make it a number if you like
  return newString; // Output the result to the form field (change for your purposes)
}

function update_total() {
  var total = 0;
  $('.price').each(function(i){
    price = $(this).html().replace("$","");
    if (!isNaN(price)) total += Number(price);
  });

  total = roundNumber(total,2);

  $('.due').html("$"+total);
}

function update_all_prices() {
  var $itemRows = $('.item-row');
  $itemRows.each(function(i) {
    update_price($(this));
  })
}
 
function update_price(row) {
  var price = row.find('.hrs').val() * $('#rate').val();
  price = roundNumber(price,2);
  isNaN(price) ? row.find('.price').html("N/A") : row.find('.price').html("$"+price);
  
  update_total();
}

function addDayOfWeek() {
  var $dateTextArea = $(this),
    dateRegex = /(?:[A-Z][a-z]+ )?[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/;
  if($dateTextArea.val().search(dateRegex) == -1) {
    return;
  }

  var datePieces = getDatePieces($dateTextArea.val()),
    date = new Date(datePieces.year, datePieces.month, datePieces.dayOfMonth),
    dayOfWeek = DAYS_OF_WEEK[date.getDay()],
    newString = $dateTextArea.val().replace(dateRegex, dayOfWeek + " " + datePieces.dateStr);
    
  $dateTextArea.val(newString);
}

function getDatePieces(str) {
  var dateStr = str.replace(/[^0-9\/]/g, ""),
    dateChunks = dateStr.split('/'),
    dayOfMonth = parseInt(dateChunks[1]),
    month = parseInt(dateChunks[0]) - 1,
    year = "20" + parseInt(dateChunks[2]);

  return {year: year, month: month, dayOfMonth: dayOfMonth, dateStr: dateStr};
}

function bind() {
  $(".hrs").blur(function() {
    update_price( $(this).parents('.item-row') );
  });
  $(".item-date").blur(addDayOfWeek);
}

$(document).ready(function() {

  $('input').click(function(){
    $(this).select();
  });

  $('#rate').blur(update_all_prices);
   
  $("#addrow").click(function(){
    var nextDayStr;

    if($('#next-day-autofill').is(':checked')) {
      //get the next date in sequence.
      var dateStr = $(".item-row:last").find(".item-date").val(),
        datePieces = getDatePieces(dateStr),
        date = new Date(datePieces.year, datePieces.month, datePieces.dayOfMonth);

      date.setDate(date.getDate() + 1);
      nextDayStr = DAYS_OF_WEEK[date.getDay()] + " " + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear().toString().substring(2);
    } else {
      nextDayStr = '';
    }

    $(".item-row:last").after('<tr class="item-row"><td><div class="delete-wpr"><textarea class="item-date" placeholder="D/M/YY">' + nextDayStr + '</textarea><a class="delete" href="javascript:;" title="Remove row">X</a></div></td><td colspan="3"><textarea class="hrs">' + NEW_ROW_HOURS + '</textarea></td><td><span class="price">$' + roundNumber(NEW_ROW_HOURS * $('#rate').val(), 2) +'</span></td></tr>');
    if ($(".delete").length > 0) $(".delete").show();
    update_total();
    bind();
  });
  
  bind();
  
  $(".delete").live('click',function(){
    $(this).parents('.item-row').remove();
    update_total();
    if ($(".delete").length < 2) $(".delete").hide();
  });
  
  $("#date").val(print_today());

  update_all_prices();
});