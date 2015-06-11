module.exports = ->
  @loadNpmTasks "grunt-contrib-sass"

  # Wipe out previous builds and test reporting.
  @config "sass",
    compile:
      options:
        style: 'expanded'
      files: [
        expand: true
        cwd: 'app/styles/scss'
        src: ['**/*.scss']
        dest: 'app/styles'
        ext: '.css'
      ]