import type { ModalProps } from 'antd'
import { Modal } from 'antd'

export function AppModal({ classNames, ...props }: ModalProps) {
    return <Modal {...props} />
}
