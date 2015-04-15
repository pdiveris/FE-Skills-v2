<?php
/**
 * Pedro Diveris
 * 
 * @property integer item_id
 * @property string submitter_id
 * @property bool in_archive
 * @property bool withdrawn
 * @property integer last_modified
 * @property integer owning_collection
 * @property bool discoverable
 */
class Item extends Eloquent  {
  protected static $dcMappings = array(
    'dc_identifier'=>17,
    'dc_description'=>26,
    'dcterms_file_format'=>33,
    'dc_publisher'=>39,
    'dc_subject'=>57,
    'dc_title'=>64,
    'jmd_jacs3_subject'=>73,
    'jmd_jacs3_code'=>74,
    'jmd_learndirect_subject'=>75,
    'jmd_learndirect_code'=>76,
  );

  protected static $meta = null;

  /**
   * The database table used by the model.
   *
   * @var string
   */
  protected $table = 'item';
  protected $primaryKey = 'item_id';

  public function __construct() {
  }

  /**
  * "Magic" function to expose the 'linked' fields.. 
  * Load only once..
  */
  public function __get($field) {
    if (array_key_exists($field, self::$dcMappings)) {
      $meta = self::$meta;
      
      if (null == $meta) {
        self::$meta = $this->metadata()->get();
      }

      $id = self::$dcMappings[$field];
      foreach (self::$meta as $data) {

        if ($data->metadata_field_id == $id) {
          return $data->text_value;
        }
      }

    }
  }

 /**
  * Get the linked tags for the Resource's Mappings
  * @return \Illuminate\Database\Eloquent\Relations\HasMany
  */
  public function metadata() {
    return($this->hasMany('Metadata', 'item_id',  'item_id'));
  }


  /**
   * Get the linked Bundles of the Item
   * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
   */
  public function bundles() {
    $ret =  $this->belongsToMany('Bundle', 'item2bundle', 'item_id', 'bundle_id');
    return $ret;
  }



}
