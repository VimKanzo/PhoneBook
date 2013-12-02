App = 
	render: => 
		$('#addNewContact').click ->
			App.addNewContact()
			return
		.click()
		
		$('#listContacts').click ->
			App.listContacts()
			return
		
		$('#searchContacts').click -> 
			App.searchContacts()
			return
			
		return 
		
	addNewContact: ->
		$('div.abPanel').load 'add_new_contact.html', -> 
			$(this).find('form').submit ->
				full_name = $('#full_name').val()
				email = $('#email').val()
				phone = $('#phone').val()
				address = $('#address').val()
				
				$.getJSON './php/addNewContact.php', {
					full_name: full_name, 
					email: email, 
					phone: phone, 
					address: address
				}, -> 
					$('span.false').html ''
					if data.success is true 
						$('form').get(0).reset()
					else 
						$.each data.validataionError, -> 
							$('span.' + this.target).html this.error
							return
					$('span.success').html(data.msg).removeClass('false').addClass data.succes.toString()
					return
				return
			return
		return
		
	listContacts: -> 
		$('div.abPanel').load 'list_contacts.html', -> 
			App.loadGrid()
			return
		return
			
	searchContacts: -> 
		$('div.abPanel').load 'search_contacts.html', -> 
			$('div#grid').load 'list_contacts.html'
			$(this).find('form').submit -> 
				full_name = $('#full_name').val()
				email = $('#email').val()
				
				App.loadGrid { 'full_name': full_name, 'email': email }
				return
			return
		return
	
	loadGrid: (params) -> 
		$.getJSON './php/listContacts.php', params, -> 
			if data.success is true 
				$('#contactsGrid tr:not(:first)').remove()
				$.each data.contacts, ->
					$('#contactsGrid tr:last').after(
						$('<tr/>')
							.append($('<td/>').html(this.full_name))
							.append($('<td/>').html(this.email))
							.append($('<td/>').html(this.phone))
							.append($('<td/>').html(this.address))
							.append($('<td/>').html('<a>Delete</a>'))
							.attr 'data-id', this.id
					)
					return
				
				$('#contactsGrid tr[data-id]').each -> 
					id = $(this).attr 'data-id'
					$(this).find('a').click -> 
						App.deleteContact id
						return
					return
				return			
		return
		
	deleteContact: -> 
		if confirm 'Are you sure to delete?' 
			$.getJSON './php/deleteContact.php', { id: id }, -> 
				if data.success is true 
					$("#contactsGrid tr[data-id='#{id}']").hide 'slow'
					return
				else 
					alert data.msg
					return
				return
			return
		
		
		
$ -> 
	App.render()
	return	
