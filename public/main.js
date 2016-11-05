

	const todolist = $('#todo_ul');
	const search_text = $('#search_box').val();
	
    const draw_list = function(){
    	const search_text = $('#search_box').val();
    	console.log(search_text);
    	$('#todo_ul').html('');
		$.ajax({
        url      : "/todos",
        type     : 'get',
        dataType : 'json',
        data     : {
        	searchtext : search_text
        },
        success  : function(data) {
        	//console.log(data);
				data.items.forEach(function(todoItem){
				const li = $('<li>'+todoItem.message+'<input type="checkbox"><button class="delete" id='+todoItem.id+'>Kill</button></li>')
				const input = li.find('input');
				input.prop('checked', todoItem.completed);
				input.on('change', function(){
					todoItem.completed = input.prop('checked');
					$.ajax({
       				 url         : "/todos/" + todoItem.id,
       				 type        : 'put',
      				  dataType    : 'json',
      				  data        : JSON.stringify(todoItem),
       				 contentType : "application/json; charset=utf-8",
       				 success     : function(data) {
       				 	
      				  },
      				  error       : function(data) {
       			     alert('Error creating todo');
      				  }
   				 });

				});
				
				todolist.append(li);
        	});},
        error    : function(data) {
            alert('Error searching');
        }
    });

};
$("#search_button").on('click', function(){
			draw_list();
		});
	

$("#create_button").on('click', function(){
	const val = $('#create_box').val();
    $('#create_box').val(''); // clear the textbox

    $.ajax({
        url         : "/todos",
        type        : 'post',
        dataType    : 'json',
        data        : JSON.stringify({
            message   : val,
            completed : false
        }),
        contentType : "application/json; charset=utf-8",
        success     : function(data) {
           location.reload();
           draw_list(); // refresh the list (re-run the search query)
        	
        },
        error       : function(data) {
            alert('Error creating todo');
        }
    }); 

});

	draw_list();
	$("#search_box").keyup(function(event){
    if(event.keyCode == 13){
        $("#search_button").click(); //pressing enter on the searchbox will act as a button
    }
});
$("#create_box").keyup(function(event){
    if(event.keyCode == 13){
        $("#create_button").click(); //pressing enter on the searchbox will act as a button
    }
});
$(document).ready(function(){
        $(".delete").click(function(todoItem) {
             $.ajax({
        url     : "/todos/" + $(this).prop('id') ,
        type    : 'delete',
        success : function(data) {
          location.reload();
          draw_list();  // remove the rendering of that item from the UI
        },
        error   : function(data) {
            alert('Error deleting the item');
        }
    });
        });
});

