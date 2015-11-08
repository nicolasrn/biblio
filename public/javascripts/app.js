(function($) {
	$(function() {
		var template = $('table.recherche').find('tbody').children();
		
		function getQuery () {
			var champ = $('input[name=query]');
			return function() {
				return champ.val();
			}
		}
		
		function rafraichir(query) {
			$.ajax({
				method : "get",
				url : "/search",
				data : {
					q:query
				}
			}).success(function(data) {
				$('table.recherche').find('tbody').children().remove();
				$('table.recherche').find('tbody').append(template);
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
		
		rafraichir(getQuery());
		
		$('input[name=query]').on('keyup', function(event) {
			rafraichir(getQuery());
		});
		
	});
})(jQuery);