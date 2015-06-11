module.exports = ->
  @loadNpmTasks "grunt-contrib-watch"

  # Wipe out previous builds and test reporting.
  @config "watch",
    html:
      files: ['**/*.html']
    sass:
      files: '<%= sass.compile.files[0].src %>'
      tasks: ['sass']
    coffee:
      files: '<%= coffee.compile.src %>'
      tasks: ['coffee']
    options:
      livereload: true