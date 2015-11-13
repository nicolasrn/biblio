(function($) {
	/**
	 * A appliquer sur un element tr
	 */
	$.fn.ajouterFormulaire = function(options) {
		var defauts = {
		};
		var parametres = $.extend(defauts, options);
		
		return this.each(function() {
			var $tr = $(this);
			
			var data = [];
			data.push({
				element: "<input type='text' name='serie' class='form-control' />",
				classe: 'col-md-2'
			});
			data.push({
				element: "<input type='text' name='titre' class='form-control' />",
				classe: 'col-md-5'
			});
			data.push({
				element: "<input type='text' name='numero' class='form-control' />",
				classe: 'col-md-1'
			});
			data.push({
				element: "<input type='text' name='annee' class='form-control' />",
				classe: 'col-md-1'
			});
			data.push({
				element: "<input type='text' name='auteur' class='form-control' />",
				classe: 'col-md-3'
			});
			data.push({
				element: "<input type='hidden' name='id' />"
			});
			data.push({
				element: "<input type='submit' />",
				classe: 'sr-only'
			});
			
			$tr.children().each(function(data) {
				return function(index, item) {
					var $input = $(data[index].element);
					var $wrapper = $('<div>').addClass('form-group');
					var $label = $('<label>').addClass('sr-only').text($input.attr('name'));
					
					$input.val($(item).text());
					$wrapper.append($label);
					$wrapper.append($input);
					
					data[index].element = $wrapper;
				};
			}(data));
			
			var $form = $('<form action="/update" method="post">').addClass('form-horizontal');
			$form.on('submit', function(event) {
				$.ajax({
					url: $(this).attr('action'),
					method: $(this).attr('method'),
					data: $(this).serialize(),
					success: function(data) {
						$form.parents('tr').remove();
					}
				}); 
				rafraichir(getQuery(), getSort());
				return false;
			});
			
			$table = $('<table>');
			var $ligne = $('<tr>');
			$ligne.append($.map(data, function (item) {
				return $('<td>').addClass(item.classe).append(item.element);
			}));
			$table.append($ligne);
			$form.append($table);
			$tr.after($('<tr>').append($('<td>').attr('colspan', data.length).append($form)));
		});
	};
	
    function getQuery () {
		var champ = $('input[name=query]');
		return function() {
			return champ.val();
		};
	}
	
	function getSort () {
		var champ = $('table.recherche a[data-selected]');
		return function() {
			var tab = [];
			if (champ.attr('id')) {
				tab.push(champ.attr('id'));
			}
			if (champ.attr('data-selected')) {
				tab.push(champ.attr('data-selected'));
			}
			return tab;
		};
	}
	
	function rafraichir(query, sort) {
		$.ajax({
			method : "get",
			url : "/search",
			data : {
				q:query,
				s:sort
			}
		}).success(function(data) {
			$('table.recherche').find('tbody').children().not(':first').remove();
			$('table.recherche').find('tbody').append($.map(data, function (item) {
				var $ligne = $('<tr>');
				$ligne.append($('<td>').text(item.serie));
				$ligne.append($('<td>').text(item.titre));
				$ligne.append($('<td>').text(item.numero));
				$ligne.append($('<td>').text(item.annee));
				$ligne.append($('<td>').text(item.auteur));
				$ligne.append($('<td>').addClass('sr-only').text(item.id));
				
				$ligne.on('dblclick', function(event) {
					$(this).ajouterFormulaire();
				});
				
				return $ligne;
			}));
		});
	}
	
	$(function() {
		$('form#search').on('submit', function(event) {
			return false;
		});
		
		$('input[name=query]').on('keyup', function(event) {
			rafraichir(getQuery(), getSort());
		});
		
		$('table.recherche a').each(function(index, item) {
			$(this).on('click', function(event) {
				var a= $(this);
				a.parents('tr').find('a').each(function(index, item) {
					if (a.attr('id') != $(item).attr('id')) {
						$(item).removeAttr('data-selected');
					}
				});
				if (!a.attr('data-selected')) {
					a.attr('data-selected', 'down');
				} else {
					if (a.attr('data-selected') === 'down') {
						a.attr('data-selected', 'up');
					} else {
						a.attr('data-selected', 'down');
					}
				}
				
				var champ = $('table.recherche a[data-selected]');
				rafraichir(getQuery(), getSort());
			});
		});
		rafraichir(getQuery(), getSort());
	});
})(jQuery);