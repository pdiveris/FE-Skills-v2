<?php
/**
 * Petros Diveris
 * Item2Bundle Model
 * March, 2015
 * 
 * @property integer id
 * @property integer item_id
 * @property integer bundle_id
 */
class Item2Bundle extends Eloquent  {
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'item2bundle';

    /**
    *
    */
    protected $fillable = array();

}
