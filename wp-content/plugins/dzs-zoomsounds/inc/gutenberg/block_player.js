/**
 * Block dependencies
 */

// import classnames from 'classnames'; 2

/**
 * Internal block libraries
 */


import './block_player.scss';
import * as configSampleData from './configs/config-samples';
import * as helpers from './js_common/_helpers';
import CustomInspectorControls from './js_dzsap/CustomInspectorControls';

let __ = (arg) => {
  return arg;
};

if (wp.i18n) {
  __ = wp.i18n.__;
}

const {registerBlockType} = wp.blocks;

const {
  RichText,
  InspectorControls,
  MediaUpload
} = wp.editor;

const {
  TextareaControl,
  SelectControl,
} = wp.components;

/**
 * Register block
 */

// const player_controls = [];
let optionsForPlayer = [];
let player_inspector_controls = null;
let player_attributes = {
  text_string: {
    type: 'string',
  },
  button: {
    type: 'string',
    default: 'button',
  },
  examples_con_opened: {
    type: 'boolean',
    default: false,
  },
  backgroundimage: {
    type: 'string',
    default: null, // no image by default!
  }
};
window.addEventListener('load', function () {


  try {
    optionsForPlayer = JSON.parse(window.dzsap_settings.player_options);
  } catch (err) {
    console.info('err - ', err, window.dzsap_settings.player_options);
  }
  // console.info('arr_options_player -6 ',arr_options);


  // arr_options.forEach(function(el4,ind) {window.dzsvg_gutenberg_player_options_for_js_init
  //   console.info('el4 - ', el4);
  // })
  // console.info('player_controls- ',player_controls);

  optionsForPlayer.forEach((el) => {


    let aux = {};

    aux.type = 'string';
    if ((el.type)) {
      aux.type = el.type;
    }
    if ((el['default'])) {

      aux['default'] = el['default'];
    }

    // -- sanitizing
    if (aux.type === 'text' || aux.type === 'textarea') {
      aux.type = 'string';
    }

    // console.log('aux.type - ',aux.type);

    if (aux.type === 'string') {
      player_attributes[el.name] = aux;
    }
  })
});


// console.info('player_attributes - ',player_attributes);
console.info('window.dzsap_gutenberg_player_options_for_js_init - ', window.dzsap_gutenberg_player_options_for_js_init);

export default registerBlockType('dzsap/gutenberg-player', {
  // Block Title
  title: 'ZoomSounds ' + __('Player'),
  // Block Description
  description: __('Powerful audio player'),
  // Block Category
  category: 'common',
  // Block Icon
  icon: 'format-audio',
  // Block Keywords
  keywords: [
    __('Audio player'),
    __('Sound'),
    __('Song'),
  ],
  attributes: window.dzsap_gutenberg_player_options_for_js_init,
  // Defining the edit interface
  edit: props => {
    // const {
    //   attributes
    // } = props;

    const onChangeTweet = value => {
      props.setAttributes({artistname: value});
    };

    // const ALLOWED_MEDIA_TYPES = ['audio'];


    // console.log('window.dzsap_gutenberg_player_options_for_js_init -', window.dzsap_gutenberg_player_options_for_js_init);
    // console.log({optionsForPlayer});
    // console.log('lets wee what props we have',props);

    let uploadButtonLabel = __('Upload');

    if (props.attributes.dzsap_meta_item_source || props.attributes.source) {
      uploadButtonLabel = __('Select another upload');
    }

    let uploadSongLabel = __('Upload song');


    player_inspector_controls = (
      <CustomInspectorControls
        arr_options={optionsForPlayer}
        skippedKeys={['dzsap_meta_item_source','source','item_source']}
        uploadButtonLabel={uploadButtonLabel}
        {...props}
      />
    );

    // console.info('optionsForPlayer- ',optionsForPlayer);
    // console.info('player_inspector_controls- ',player_inspector_controls);


    function dzsap_setShortcodeAttribute(args) {
      props.setAttributes(args);
    }

    const import_sample = (arg) => {
      // console.log(this, arg);

      if (arg && arg.getAttribute('data-the-name')) {

        // console.log(arg.getAttribute('data-the-name'));
        var theName = arg.getAttribute('data-the-name');
        helpers.postAjax(dzsap_settings.siteurl + '?dzsap_action=dzsap_import_vp_config', 'name=' + theName, () => {

          dzsap_setShortcodeAttribute({source: 'https://zoomthe.me/tests/sound-electric.mp3'});
          dzsap_setShortcodeAttribute({config: theName});
          dzsap_setShortcodeAttribute({artistname: theName});
          dzsap_setShortcodeAttribute({examples_con_opened: !props.attributes.examples_con_opened});


          if (theName === 'sample--boxed-inside') {
            // props.setAttribute()

            dzsap_setShortcodeAttribute({wrapper_image_type: "zoomsounds-wrapper-bg-bellow"});
            dzsap_setShortcodeAttribute({wrapper_image: "https://zoomthe.me/tests/bg_blur.jpg"});

          }
        });
      }
    };

    const examples_con_opened = props.attributes.examples_con_opened;
    const arr_examples = configSampleData.arr_examples;
    // const self = this;
    // console.log('props -5 ',props);
    return [
      !!props.isSelected && (
        <InspectorControls key="inspector">
          {player_inspector_controls}
        </InspectorControls>
      ),
      <div className={props.className}>
        <div className={(props.attributes.theme ? 'gt-zoomsounds-main-con-alt' : 'gt-zoomsounds-main-con')}>
          <div className="dzsap-gutenberg-con--player zoomsounds-containers">
            <h6 className="gutenberg-title"><span
  className="dashicons dashicons-format-audio"/> {__('Zoomsounds Player')}</h6>
            <h6 className="gutenberg-title"><span className="gutenberg-title--label">{__('Song Name:')}</span> <RichText
              format="string"
              formattingControls={[]}
              placeholder={__('here')}
              onChange={(val) => props.setAttributes({the_post_title: val})}
              value={props.attributes.the_post_title}
            />
            </h6>
            <div className="react-setting-container">
              <div className="react-setting-container--label">{__('Artist name')}</div>
              <div className="react-setting-container--control">
                <RichText
                  format="string"
                  formattingControls={[]}
                  placeholder={__('Input artist name')}
                  onChange={onChangeTweet}
                  value={props.attributes.artistname}
                />
              </div>
            </div>

            <div className="react-setting-container">
              <div className="react-setting-container--label">{__('Song source')}</div>
              <div className="react-setting-container--control">
                <MediaUpload
                  onSelect={(attachmentObject) => {
                    console.log('attachmentObject - ', attachmentObject);


                    var filename = attachmentObject && attachmentObject.filename ? attachmentObject.filename : '';
                    var attachmentId = attachmentObject.id ? attachmentObject.id : 0;
                    var sourceForDzsap = attachmentObject.url;


                    props.setAttributes({source: sourceForDzsap});
                    props.setAttributes({playerid: attachmentId});
                    props.setAttributes({wpAudioPost: attachmentId});


                    if (filename && filename.length > 5 && (filename.indexOf('.mp3') > filename.length - 5 || filename.indexOf('.wav') > filename.length - 5 || filename.indexOf('.m4a') > filename.length - 5)) {
                      window.dzsap_waveform_autogenerateWithId(attachmentId)
                    }

                    // console.info(' props select - ', attachmentObject);
                  }}
                  allowedTypes={['audio']}
                  value={props.attributes.source} // make sure you destructured backgroundImage from props.attributes!
                  render={({open}) => (
                    <div className="render-song-selector">
                      {props.attributes.source ? (
                        <TextareaControl
                          format="string"
                          rows="1"
                          formattingControls={[]}
                          placeholder={__('Input song name')}
                          onChange={(val) => {
                            props.setAttributes({source: val});
                            props.setAttributes({playerid: ''});
                          }}
                          value={props.attributes.source}
                        />
                      ) : ""}
                      <button className="button-secondary" onClick={open}>{uploadSongLabel}</button>
                    </div>
                  )}
                />
              </div>
            </div>


            {
              props.isSelected && optionsForPlayer && optionsForPlayer[9] && (
                <div className="react-setting-container" >
                  <div className="react-setting-container--label">{__('Player configuration')}</div>
                  <div className="react-setting-container--control">

                    {
                      (<SelectControl
                        options={optionsForPlayer[9].choices}
                        onChange={ (value) => {
                          props.setAttributes({config: value});
                        }}
                        value={props.attributes.config}
                      />)
                    }

                  </div>
                </div>
              )
            }


            <div className={examples_con_opened ? "gt-zoomsounds-examples-con opened" : "gt-zoomsounds-examples-con "}>
              <h6 onClick={() => {
                // console.log('click', props.attributes.examples_con_opened, props);

                props.setAttributes({examples_con_opened: !props.attributes.examples_con_opened});
              }}>{__('Examples')} <span className={"the-icon"}> &#x025BF;</span></h6>
              <div className={"sidenote"}>{__('Import examples with one click')}</div>
              <div className={"dzs-player-examples-con"}>
                {arr_examples.map((el, key) => {
                  return (
                    <div className={"dzs-player-example"} key={key} onClick={(e) => {
                      import_sample(e.currentTarget)
                    }} data-the-name={el.name}>
                      <img alt={"sample image"} className={"the-img"} src={dzsap_settings.thepath + el.img}/>
                      <h6 className={"the-label"}>{el.label}</h6>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>

          <p>
            <a className="ctt-btn">
              {props.attributes.button}
            </a>
          </p>
        </div>
      </div>
    ];
  },
  // Defining the front-end interface
  save() {
    // Rendering in PHP
    return null;
  },
});
