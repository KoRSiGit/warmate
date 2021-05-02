// License: GPLv2+

var __ = wp.i18n.__; // The __() for internationalization.
var el = wp.element.createElement,
  registerBlockType = wp.blocks.registerBlockType,
  ServerSideRender = wp.components.ServerSideRender,
  TextControl = wp.components.TextControl,
  InspectorControls = wp.editor.InspectorControls;

var SelectControl = wp.components.SelectControl;
const {MediaUpload} = wp.components;

/*
 * Here's where we register the block in JavaScript.
 *
 * It's not yet possible to register a block entirely without JavaScript, but
 * that is something I'd love to see happen. This is a barebones example
 * of registering the block, and giving the basic ability to edit the block
 * attributes. (In this case, there's only one attribute, 'foo'.)
 */
console.info("REGISTER", wp.components,wp.editor);


var blockKey = 'dzsap/gutenberg-block';
registerBlockType( blockKey, {
  title: 'ZoomSounds ' + __('Playlist'),
  icon: 'screenoptions',
  category: 'widgets',

  /*
   * In most other blocks, you'd see an 'attributes' property being defined here.
   * We've defined attributes in the PHP, that information is automatically sent
   * to the block editor, so we don't need to redefine it here.
   */

  edit: function( props ) {


    var arr_options = [];

    try{
      arr_options = JSON.parse(window.dzsap_options_shortcode_generator)
    }catch(err){

    }
    console.info('arr_options - ',arr_options);


    var foutarr = [
      /*
       * The ServerSideRender element uses the REST API to automatically call
       * php_block_render() in your PHP code whenever it needs to get an updated
       * view of the block.
       */
      el( ServerSideRender, {
        block: blockKey,
        attributes: props.attributes,
      } ),
      /*
       * InspectorControls lets you add controls to the Block sidebar. In this case,
       * we're adding a TextControl, which lets us edit the 'foo' attribute (which
       * we defined in the PHP). The onChange property is a little bit of magic to tell
       * the block editor to update the value of our 'foo' property, and to re-render
       * the block.
       */

      el( InspectorControls, {},
        el(
          SelectControl,
          {
            label: __('Select gallery'),
            value: props.attributes.dzsap_select_id ? props.attributes.dzsap_select_id : '',
            instanceId: 'dzsap_select_id',
            onChange: function (value) {
              props.setAttributes({
                dzsap_select_id: value
              });
            },
            options: dzsap_settings.sliders,
          }
        ),
      )

    ];

;


    return foutarr;
  },

  // We're going to be rendering in PHP, so save() can just return null.
  save: function() {
    return null;
  },
} );


// var blockPlayer = 'dzsap/gutenberg-player';
// registerBlockType( blockPlayer, {
//   title: 'ZoomSounds ' + __('Player'),
//   icon: 'screenoptions',
//   category: 'widgets',
//
//   /*
//    * In most other blocks, you'd see an 'attributes' property being defined here.
//    * We've defined attributes in the PHP, that information is automatically sent
//    * to the block editor, so we don't need to redefine it here.
//    */
//
//   edit: function( props ) {
//
//
//     var arr_options = [];
//
//     try{
//       arr_options = JSON.parse(window.dzsap_settings.player_options);
//     }catch(err){
//       console.info('err - ',err,window.dzsap_settings.player_options);
//
//     }
//     console.info('arr_options_player - ',arr_options);
//
//
//
//
//
//
//     var controls = [];
//     arr_options.forEach(function(el4,ind){
//       console.info('el4 - ',el4);
//
//       var args = {
//           label: el4.title,
//           value: props.attributes[el4.name] ? props.attributes[el4.name] : '',
//           instanceId: el4.name,
//           onChange: function (value) {
//             props.setAttributes({[el4.name]: value});
//           },
//         }
//       ;
//
//
//       if(el4.type=='select'){
//         if(el4.choices && typeof el4.options == 'undefined'){
//           el4.options = el4.choices;
//         }
//         args.options = el4.options;
//
//
//       }
//
//       if(el4.type=='text'){
//         controls.push(el(
//           TextControl,args
//         ))
//       }
//       if(el4.type=='attach'){
//         args.type='image';
//         controls.push(el(
//           MediaUpload,args
//         ))
//       }
//       if(el4.type=='select'){
//         controls.push(el(
//           SelectControl,args
//         ))
//       }
//     });
//     console.info('controls - ',controls);
//
//     var foutarr = [
//       /*
//        * The ServerSideRender element uses the REST API to automatically call
//        * php_block_render() in your PHP code whenever it needs to get an updated
//        * view of the block.
//        */
//       el( ServerSideRender, {
//         block: blockPlayer,
//         attributes: props.attributes,
//       } ),
//       /*
//        * InspectorControls lets you add controls to the Block sidebar. In this case,
//        * we're adding a TextControl, which lets us edit the 'foo' attribute (which
//        * we defined in the PHP). The onChange property is a little bit of magic to tell
//        * the block editor to update the value of our 'foo' property, and to re-render
//        * the block.
//        */
//
//
//
//       el( InspectorControls, {},controls,
//       )
//
//     ];
//
//     ;
//
//
//     return foutarr;
//   },
//
//   // We're going to be rendering in PHP, so save() can just return null.
//   save: function() {
//     return null;
//   },
// } );