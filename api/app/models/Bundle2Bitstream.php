<?php
/**
 * Petros Diveris
 * Item2Bundle Model
 * March, 2015
 * 
 * @property integer id
 * @property integer bundle_id
 * @property integer bitstream_id
 * @property integer bitstream_order
 *
 */
class Bundle2Bitstream extends Eloquent  {
  /**
   * The database table used by the model.
   *
   * @var string
   */
  protected $table = 'bundle2bitstream';

 /**
  * fillable array...
  */
  protected $fillable = array();

}
