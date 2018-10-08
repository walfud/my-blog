import PropTypes from 'prop-types'
import Config from '../../config'

export const PostDataTypes = {
    title: PropTypes.string.isRequired,
    time: PropTypes.number.isRequired,      // 创建时间 (ms)
    path: PropTypes.string.isRequired,      // 文章的路径, 也作为文章的唯一标识
    type: PropTypes.oneOf(['md', 'html', 'dir']).isRequired,
}