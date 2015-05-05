<?php
/**
 * Pedro Diveris
 * 
 * @property integer metadata_value_id
 * @property integer item_id
 * @property integer metadata_field_id
 * @property text text_value
 * @property varchar text_lang
 * @property integer place
 * @property varchar authority
 * @property integer confidence
 * 
 */
class Metadata extends Eloquent  {
  /**
   * The database table used by the model.
   *
   * @var string
   */
  protected $table = 'metadatavalue';



}
