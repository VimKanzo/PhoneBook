var App = {
    render: function () {
        $('#addNewContact').click(function () {
            App.addNewContact();
        });
        $('#listContacts').click(function () {
            App.listContacts();
        });        
        $('#searchContacts').click(function () {
            App.searchContacts();
        });
        App.addNewContact();
    },     
    
    addNewContact: function () {
        $('div.abPanel').load('add_new_contact.html', function () {            
            $(this).find('form').submit(function() {
                var full_name = $('#full_name').val(), 
                    email = $('#email').val(), 
                    phone = $('#phone').val(), 
                    address = $('#address').val();
                    
                $.getJSON('./php/addNewContact.php', {
                    'full_name': full_name, 
                    'email': email, 
                    'phone': phone, 
                    'address': address
                }, function (data) {
                    $('span.false').html('');
                    if (data.success === true) { 
                        $('form').get(0).reset();
                    } else {
                        $.each(data.validationError, function () {
                            $('span.' + this.target).html(this.error);
                        });
                    }       
                    $('span.success').html(data.msg).removeClass('false').addClass(data.success.toString());
                });
              
                return false;
            });
        });
    },
    
    listContacts: function () {
        $('div.abPanel').load('list_contacts.html', function () {
            App.loadGrid();
        });
    }, 
    
    searchContacts: function () {
        $('div.abPanel').load('search_contacts.html', function () {            
            $('div#grid').load('list_contacts.html');
            $(this).find('form').submit(function() {
                var full_name = $('#full_name').val(), 
                    email = $('#email').val(); 
                
                App.loadGrid({ 'full_name': full_name, 'email': email });                
                return false;
            });
        });
    }, 
    
    loadGrid: function (params) {
        $.getJSON('./php/listContacts.php', params, function (data) {
            if (data.success === true) {
                $('#contactsGrid tr:not(:first)').remove();
                $.each(data.contacts, function () {
                    $('#contactsGrid tr:last').after(
                        $('<tr/>')
                            .append($('<td/>').html(this.full_name))
                            .append($('<td/>').html(this.email))
                            .append($('<td/>').html(this.phone))
                            .append($('<td/>').html(this.address))
                            .append($('<td/>').html('<a>Delete</a>'))
                            .attr('data-id', this.id)
                    );
                });
                
                $('#contactsGrid tr[data-id]').each(function () {
                    var id = $(this).attr('data-id');
                    
                    $(this).find('a').click(function () {
                        App.deleteContact(id);
                    });
                });
            }           
        });        
    }, 
    
    deleteContact: function (id) {
        if (confirm('Are you sure to delete?')) {
            $.getJSON('./php/deleteContact.php', { id: id }, function (data) {
                if (data.success === true) {
                    $('#contactsGrid tr[data-id="' + id + '"]').hide('slow');
                } else {
                    alert(data.msg);
                }
            });
        }
    }
};

$(function () {
    App.render();
});
