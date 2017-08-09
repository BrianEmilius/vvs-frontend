/* globals window,document,fetch */
(() => {
	'use strict';
	const api = 'http://localhost:1337';

	/**
	 * Returns the value of a URL parameter
	 * @param {number} sParam
	 */
	const getUrlParameter = function (sParam) {
		const sPageURL = decodeURIComponent(window.location.search.substring(1));
		const sURLVariables = sPageURL.split('&');
		let sParameterName;
		for (let int = 0; int < sURLVariables.length; int = int + 1) {
			sParameterName = sURLVariables[int].split('=');
			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? true : sParameterName[1];
			}
		}
	};

	/**
	 * Paint site with page data
	 * @param {string} api - URL of the API to call
	 * @param {number} id
	 * @param {object} pageHeading
	 * @param {object} content
	 */
	const paintPage = function paintPage (api, id, pageHeading, content) {
		fetch(`${api}/pages/${id}`)
			.then((result) => result.json())
			.then((result) => {
				pageHeading.innerHTML = result[0].title;
				content.innerHTML = result[0].body;
			});
	};

	/**
	 * Paint site with site data
	 * @param {string} api - URL of the API to call
	 * @param {object} primaryNavigation 
	 */
	const paintSite = function paintSite (api, primaryNavigation) {
		fetch(`${api}/pages`)
			.then((result) => result.json())
			.then((result) => {
				let menuItems = '';
				result.forEach((page) => {
					menuItems += `<li>
						<a href="/?p=${page.id}" data-href="/?p=${page.id}">${page.title}</a>
					</li>`;
				});
				primaryNavigation.innerHTML = menuItems;
			});
	};

	document.addEventListener('DOMContentLoaded', () => {
		const pageHeading = document.querySelector('.pageHeading');
		const content = document.querySelector('.content');
		const primaryNavigation = document.querySelector('.primaryNavigation');
		let currentPage = getUrlParameter('p') || '1';

		document.addEventListener('click', (event) => {
			const targetElement = event.target || event.srcElement;
			if (targetElement.tagName.toLowerCase() === 'a' && targetElement.dataset.href) {
				event.preventDefault();
				if (targetElement.dataset.href === `/${window.location.search}`) {
					return;
				}
				window.history.pushState('', '', targetElement.dataset.href);
				currentPage = getUrlParameter('p') || 1;
				paintPage(api, currentPage, pageHeading, content);
			}
		});

		paintPage(api, currentPage, pageHeading, content);
		paintSite(api, primaryNavigation);
	});
})();