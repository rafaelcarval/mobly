<?php

/**
 * This is the model class for table "MB_USERS".
 *
 * The followings are the available columns in table 'MB_USERS':
 * @property integer $id
 * @property string $name
 * @property string $last_name
 * @property string $gender
 * @property string $street
 * @property string $number
 * @property string $complement
 * @property string $neighborhood
 * @property integer $city_id
 * @property integer $state_id
 * @property integer $country
 * @property string $phone_ddd
 * @property string $phone
 * @property string $celphone_ddd
 * @property string $celphone
 * @property string $email
 * @property string $login
 * @property string $pass
 */
class MB_USERS extends CActiveRecord
{
	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'MB_USERS';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('name, last_name, gender, street, number, complement, neighborhood, city_id, state_id, country, phone_ddd, phone, celphone_ddd, celphone, email, login, pass', 'required'),
			array('city_id, state_id, country', 'numerical', 'integerOnly'=>true),
			array('name, neighborhood, email', 'length', 'max'=>50),
			array('last_name, street, complement', 'length', 'max'=>100),
			array('gender, number', 'length', 'max'=>10),
			array('phone_ddd, celphone_ddd', 'length', 'max'=>2),
			array('phone', 'length', 'max'=>8),
			array('celphone', 'length', 'max'=>9),
			array('login, pass', 'length', 'max'=>20),
			// The following rule is used by search().
			// Please remove those attributes that should not be searched.
			array('id, name, last_name, gender, street, number, complement, neighborhood, city_id, state_id, country, phone_ddd, phone, celphone_ddd, celphone, email, login, pass', 'safe', 'on'=>'search'),
		);
	}

	/**
	 * @return array relational rules.
	 */
	public function relations()
	{
		// NOTE: you may need to adjust the relation name and the related
		// class name for the relations automatically generated below.
		return array(
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'id' => 'Id',
			'name' => 'Name',
			'last_name' => 'Last Name',
			'gender' => 'Gender',
			'street' => 'Street',
			'number' => 'Number',
			'complement' => 'Complement',
			'neighborhood' => 'Neighborhood',
			'city_id' => 'City',
			'state_id' => 'State',
			'country' => 'Country',
			'phone_ddd' => 'Phone Ddd',
			'phone' => 'Phone',
			'celphone_ddd' => 'Celphone Ddd',
			'celphone' => 'Celphone',
			'email' => 'Email',
			'login' => 'Login',
			'pass' => 'Pass',
		);
	}

	/**
	 * Retrieves a list of models based on the current search/filter conditions.
	 *
	 * Typical usecase:
	 * - Initialize the model fields with values from filter form.
	 * - Execute this method to get CActiveDataProvider instance which will filter
	 * models according to data in model fields.
	 * - Pass data provider to CGridView, CListView or any similar widget.
	 *
	 * @return CActiveDataProvider the data provider that can return the models based on the search/filter conditions.
	 */
	public function search()
	{
		// Warning: Please modify the following code to remove attributes that
		// should not be searched.

		$criteria=new CDbCriteria;

		$criteria->compare('id',$this->id);

		$criteria->compare('name',$this->name,true);

		$criteria->compare('last_name',$this->last_name,true);

		$criteria->compare('gender',$this->gender,true);

		$criteria->compare('street',$this->street,true);

		$criteria->compare('number',$this->number,true);

		$criteria->compare('complement',$this->complement,true);

		$criteria->compare('neighborhood',$this->neighborhood,true);

		$criteria->compare('city_id',$this->city_id);

		$criteria->compare('state_id',$this->state_id);

		$criteria->compare('country',$this->country);

		$criteria->compare('phone_ddd',$this->phone_ddd,true);

		$criteria->compare('phone',$this->phone,true);

		$criteria->compare('celphone_ddd',$this->celphone_ddd,true);

		$criteria->compare('celphone',$this->celphone,true);

		$criteria->compare('email',$this->email,true);

		$criteria->compare('login',$this->login,true);

		$criteria->compare('pass',$this->pass,true);

		return new CActiveDataProvider('MB_USERS', array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * Returns the static model of the specified AR class.
	 * @return MB_USERS the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}
}