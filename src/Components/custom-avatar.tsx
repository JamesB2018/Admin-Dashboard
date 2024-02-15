 import {Avatar as AntdAvatar} from 'antd'
 
 const CustomAvatar = () => {
  return (
    <AntdAvatar
    alt={'WHatever I want'}
    size="small"
    style={{ 
        backgroundColor: '#87d068',
        display: 'flex',
        alignItems: 'center',
        border: 'none'
    }}
    >
        JB
    </AntdAvatar>
  )
}

export default CustomAvatar