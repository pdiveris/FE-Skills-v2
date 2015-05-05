<?php
/**
 * Pedro Diveris
 * Jisc
 * March 2015
 * 
 *
 * @property integer bitstream_id
 * @property integer  bitstream_format_id
 * @property string name 
 * @property integer size_bytes
 * @property string checksum
 * @property string checksum_algorithm 
 * @property string description
 * @property string user_format_description
 * @property string source
 * @property string internal_id
 * @property bool deleted
 * @property integer store_number
 * @property integer sequence_id 
 *
 */
class Bitstream extends Eloquent  {
 /**
  * The database table used by the model.
  *
  * @var string
  */
  protected $table = 'bitstream';

  /**
  * La llave primera
  */
  protected $primaryKey = 'bitstream_id';


  /**
   * Validation rules
   */
  public static $rules = array();
  /**
  *
  */
  protected $fillable = array();

}
