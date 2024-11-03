import PropTypes from 'prop-types'

import { forwardRef, useImperativeHandle, useState } from 'react'

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => ({ toggleVisibility }))

  return (
    <div>
      <div>
        {!visible && (
          <button onClick={toggleVisibility}>{props.buttonLabel}</button>
        )}
      </div>
      <div style={showWhenVisible}>{props.children}</div>
      {visible && <button onClick={toggleVisibility}>Cancel</button>}
    </div>
  )
})

Togglable.displayName = 'Togglable'

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
}

export default Togglable
