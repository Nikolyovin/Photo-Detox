const { withAndroidStyles } = require('@expo/config-plugins')

const withDisableForcedDarkModeAndroid = (config) => {
  return withAndroidStyles(config, (config) => {
    const styles = config.modResults.resources.style || []
    const appTheme = styles.find(
      (style) => style.$ && style.$.name === 'AppTheme',
    )

    if (appTheme) {
      // Удаляем старый параметр, если он уже был
      appTheme.item = appTheme.item.filter(
        (item) => item.$.name !== 'android:forceDarkAllowed',
      )

      // Добавляем новый параметр внутрь существующего AppTheme
      appTheme.item.push({
        $: { name: 'android:forceDarkAllowed' },
        _: 'false',
      })
    }

    return config
  })
}

module.exports = withDisableForcedDarkModeAndroid
