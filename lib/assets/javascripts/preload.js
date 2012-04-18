/**
 * This file has no library support as it is the bootstrap file for the rest
 * of the lib. Please try to keep it as simple as possible only defining whats
 * required to bootstrap the library
 */

window.M = window.M || {

  /**
   * Copy from one object to the specified namespace that is G.<target>.
   * If the namespace target doesn't exist, it will be created automatically.
   *
   * @param target    {Object|String}  the target object to copy into
   * @param source    {Object}         the source object to copy from
   * @param overwrite {Boolean}        indicate if we should overwrite
   * @return {Object} the *same* target object back
   */
  provide:function (target, source, overwrite) {
    return this.copy(
      typeof target == 'string' ? this.create(target) : target,
      source,
      overwrite
    );
  },

  /**
   * Create a namespaced object.
   *
   * @param name {String} full qualified name ('Util.foo', etc.)
   * @param value {Object} value to set. Default value is {}. [Optional]
   * @return {Object} The created object
   */
  create:function (name, value) {
    var node = window.M,
      nameParts = name ? name.split('.') : [],
      len = nameParts.length;
    for (var i = 0; i < len; i++) {
      var part = nameParts[i];
      var nso = node[part]; //nso = namespaced object
      if (!nso) { //prevents overriding
        nso = (value && i + 1 == len) ? value : {};
        node[part] = nso;
      }
      node = nso;
    }
    return node;
  },

  /**
   * Copies things from source into target.
   *
   * @param target    {Object}
   * @param source    {Object}
   * @param overwrite {Boolean}
   * @param transform  {function} [Optional], transformation function for
   *                            each item
   */
  copy:function (target, source, overwrite, transform) {
    for (var key in source) {
      if (overwrite || typeof target[key] === 'undefined') {
        target[key] = transform ? transform(source[key]) : source[key];
      }
    }
    return target;
  }
};

