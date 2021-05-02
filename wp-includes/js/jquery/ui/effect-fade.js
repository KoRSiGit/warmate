/*!
 * jQuery UI Effects Fade 1.12.1
 * https://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * https://jquery.org/license
 */

//>>label: Fade Effect
//>>group: Effects
//>>description: Fades the element.
//>>docs: https://api.jqueryui.com/fade-effect/
//>>demos: https://jqueryui.com/effect/

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [
			"jquery",
			"./effect"
		], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}( function( $ ) {

return $.effects.define( "fade", "toggle", function( options, done ) {
	var show = options.mode === "show";

	$( this )
		.css( "opacity", show ? 0 : 1 )
		.animate( {
			opacity: show ? 1 : 0
		}, {
			queue: false,
			duration: options.duration,
			easing: options.easing,
			complete: done
		} );
} );

} ) );
