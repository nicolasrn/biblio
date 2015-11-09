(function($) {
	$(function() {
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
					var ligne = $('<tr>');
					ligne.append($('<td>').text(item.serie));
					ligne.append($('<td>').text(item.titre));
					ligne.append($('<td>').text(item.numero));
					ligne.append($('<td>').text(item.annee));
					ligne.append($('<td>').text(item.auteur));
					return ligne;
				}));
			});
		};
		
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
				
				var champ = champ = $('table.recherche a[data-selected]');
				rafraichir(getQuery(), getSort());
			});
		});
		
		rafraichir(getQuery(), getSort());
	});
})(jQuery);