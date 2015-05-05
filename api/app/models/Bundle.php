<?php
/**
 * Petros Diveris
 * Bundle Model
 * March, 2015
 * 
 * @property integer bundle_id
 * @property string name
 * @property integer primary_bitstream_id
 *
 */
class Bundle extends Eloquent  {
  /**
   * The database table used by the model.
   *
   * @var string
   */
  protected $table = 'bundle';

  protected $primaryKey = 'bundle_id';
  /**
  *
  */
  protected $fillable = array();

  /**
   * Get the linked Bitstreams of the Bundle
   * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
   */
  public function bitstreams() {
    $ret =  $this->belongsToMany('Bitstream', 'bundle2bitstream', 'bundle_id', 'bitstream_id');
    return $ret;
  }
}
