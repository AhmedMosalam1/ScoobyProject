const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        //maxlength:[20,'Maximum 10 characters'],
        //minlength:[3,'Minimum 3 characters'],
        //required:[true,'The name field must not be empty']
    },
    firstName:String,
    lastName:String,
    bio:String,
    email: {
        type: String,
        //required:[true,'Please enter your email address '],
        //validate:[validator.isEmail,'Please enter a valid email address, e.g.joe@mail.com valid email']
    },
    password: {
        type: String,
        //minlength:[8,'Must at least 8 characters long'],
        //required:[true,'Please enter your password'],
        select: false
    },
    // confirmPassword:{
    //     type:String,
    //     required:[true,'Please confirm your password'],
    //     validate :[function(el){return el === this.password},'Are not the same']
    // },
    accountId: {
        type: String
    },
    provider: {
        type: String
    },
    profileImage: {
        type: String,
        default: "https://res.cloudinary.com/dhddxcwcr/image/upload/v1700416252/6558f05c2841e64561ce75d1_Cover.jpg"
    },
    pets:[{
        type:mongoose.Schema.ObjectId,
        ref:'pets',
    }],
    role: {
        type: String,
        enum: ['user', 'doctor', 'employee',"admin"],
        default: 'user',
    },
    services_id: [{
        type: mongoose.Schema.ObjectId,
        ref: 'services',
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    phoneNumber:{
        type:String
    },
    favPet:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'pet'
    }],
    favPetsNumber:{
        type:Number
    },
    favProduct:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    }],
    favProductsNumber:{
        type:Number
    },
    cards:[{}],
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}, {
    timestamps: true,

})

userSchema.virtual('pet', {
    ref: 'pet',
    foreignField: 'user',
    localField: '_id'
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) { return next() }
    this.password = await bcrypt.hash(this.password, Number(process.env.SALT))
    this.confirmPassword = undefined
    next()
})

userSchema.methods.correctPassword = async function (candidatepassword, userpassword) {
    return await bcrypt.compare(candidatepassword, userpassword)
}

userSchema.methods.generateToken = function (id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_IN
    });
}

userSchema.pre('save', function(next) {
    if (this.role !== 'user') {
        this.followers = undefined; // Exclude followers
        this.following = undefined; // Exclude following
    }
    next();
});

userSchema.post('findOneAndUpdate', async function (doc) {
  if (doc) {
    const update = this.getUpdate().$set || {};
    const modifiedFirstName = update.hasOwnProperty('firstName');
    const modifiedLastName = update.hasOwnProperty('lastName');

    if (modifiedFirstName || modifiedLastName) {
      const firstName = modifiedFirstName ? update.firstName : doc.firstName;
      const lastName = modifiedLastName ? update.lastName : doc.lastName;
      doc.name = `${firstName} ${lastName}`;
      await doc.save();
    }
  }
});

const userModel = mongoose.model("user", userSchema)

module.exports = userModel
