/* <![CDATA[ */
(function($){
	
	"use strict";
	
    $(document).ready(function(){

        /*
         * Content Block Labels
         */

        function label_content_blocks() {

            $('.wpb_ut_content_block .vc_admin_label.admin_label_id').each(function () {

                var $this = $(this);

                // replace existing labels
                if( $this.closest('.wpb_ut_content_block').children('.vc_controls').children('.vc_row-name-id').length ) {

                    $this.closest('.wpb_ut_content_block').children('.vc_controls').children('.vc_row-name-id').replaceWith( $('<span class="vc_row-name-id">' + $this.text() + '</span>') );

                    // create new labels
                } else {

                    $this.closest('.wpb_ut_content_block').children('.vc_controls').append( $('<span class="vc_row-name-id">' + $this.text() + '</span>') );

                }

            });

        }

        /**
         * Move Secondary Title
         */

        $('<div class="secondary-title-holder"></div>').insertAfter('#titlewrap').append( $('#ut-secondary-title-wrap') );

        /* 
         * Overlay for Visual Composer
         */

        $(document).on('click', '#vc_no-content-add-element, #vc_add-new-element, .vc_add-element-not-empty-button, .vc_control.column_edit, .vc_control-btn.vc_control-btn-edit', function(event) {

            event.preventDefault();

            if( $(this).closest('.wpb_content_element').hasClass('wpb_rev_slider') )  {
                return;
            }

            $('#ut-vc-overlay').addClass("show");


        });

        $(document).on('click', '[data-vc-ui-element="button-save"], [data-vc-ui-element="button-close"], .vc_shortcode-link', function(event) {

            // update labels for content blocks
            label_content_blocks();

            $('#ut-vc-overlay').removeClass("show");
            event.preventDefault();

        });



        $(document).on('click', '[data-vc-ui-element="button-save"], [data-vc-ui-element="button-close"], .vc_shortcode-link', function(event) {

            $('#ut-vc-overlay').removeClass("show");            
            event.preventDefault(); 

        });
        
        /* 
         * Force People to add Section in top level
         */

        $(document).on('click', '#vc_no-content-add-element, #vc_not-empty-add-element, #vc_add-new-element', function(event) {

            var $modal = $('#vc_ui-panel-add-element');

            $modal.find('ul.vc_ui-tabs-line').children('.vc_edit-form-tab-control').not('.ut-structual, .ut-all').each(function() {

                $(this).hide();

            });

            $modal.find('.wpb-layout-element-button').each(function() {

                if( $(this).data('element') !== 'vc_section' && $(this).data('element') !== 'ut_split_section' && $(this).data('element') !== 'ut_custom_section' ) {

                    $(this).addClass('vc_inappropriate');

                }

                if( !$("body").hasClass('post-type-ut-content-block') && $(this).data('element') === 'ut_content_block'  ) {

                    $(this).removeClass('vc_inappropriate');

                }

            });

            event.preventDefault();

        });

        // temporary solution until option dependency hits
        $(document).on('change', '[name="caption_style"]', function(event) {

            if( $(this).hasClass('-style-2') ) {

                if( $(this).closest('.vc_shortcode-param').next('[data-vc-shortcode-param-name="caption_content"]').find('[name="caption_content"]').val() === 'plus' ) {

                    $(this).closest('.vc_shortcode-param').next('[data-vc-shortcode-param-name="caption_content"]').find('[name="caption_content"]').prop('selectedIndex', 0).trigger("change");

                }

                $(this).closest('.vc_shortcode-param').next('[data-vc-shortcode-param-name="caption_content"]').find('.plus').hide();

            } else {

                $(this).closest('.vc_shortcode-param').next('[data-vc-shortcode-param-name="caption_content"]').find('.plus').show();

            }

        });

        $(window).on("load", function () {

            label_content_blocks();

        });
         
    });
        
})(jQuery);
 /* ]]> */	