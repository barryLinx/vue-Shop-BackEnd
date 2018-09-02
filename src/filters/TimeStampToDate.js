export default function(date){
  var dates = new Date(date);
  var year = dates.getFullYear();
  var month = dates.getMonth() + 1;
  var date = dates.getDate() ;
  // var hours = dates.getHours();
  // var minutes = dates.getMinutes();
  // var seconds = dates.getSeconds();

  return `${year}/${month}/${date}`
  //return `${year}/${month}/${date} ${hours}:${minutes}:${seconds}`
  //return setInterval(function(){`${year}/${month}/${date} ${hours}:${minutes}:${seconds}`},100);

}