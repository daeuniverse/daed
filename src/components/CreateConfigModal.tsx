import {
  Button,
  Flex,
  FormControl,
  FormControlProps,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Switch,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import NumberInput from "./NumberInput";

const Field: React.FC<{ labelNode: React.ReactNode } & FormControlProps> = ({ labelNode, children, ...props }) => (
  <FormControl {...props}>
    <FormLabel>{labelNode}</FormLabel>

    {children}
  </FormControl>
);

export default ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { t } = useTranslation();

  const sliderLabelStyles = {
    mt: 2,
    ml: "-50%",
    w: "full",
    fontSize: "sm",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent>
        <ModalCloseButton />

        <ModalHeader>{t("create config")}</ModalHeader>

        <ModalBody>
          <Flex direction="column" gap={4}>
            <Field labelNode={t("tproxyPort")}>
              <NumberInput min={0} max={65535} />
            </Field>

            <Field labelNode={t("logLevel")} pb={4}>
              <Slider step={25} textAlign="center">
                <SliderMark value={25} {...sliderLabelStyles}>
                  {t("warn")}
                </SliderMark>
                <SliderMark value={50} {...sliderLabelStyles}>
                  {t("info")}
                </SliderMark>
                <SliderMark value={75} {...sliderLabelStyles}>
                  {t("debug")}
                </SliderMark>

                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>

                <SliderThumb />
              </Slider>
            </Field>

            <Field labelNode={t("tcpCheckUrl")}>
              <Input />
            </Field>

            <Field labelNode={t("udpCheckDns")}>
              <Input />
            </Field>

            <Field labelNode={t("checkInterval")}>
              <NumberInput min={0} />
            </Field>

            <Field labelNode={t("checkTolerance")}>
              <NumberInput min={0} />
            </Field>

            <Field labelNode={t("dnsUpstream")}>
              <Input />
            </Field>

            <Field labelNode={t("lanInterface")} isRequired>
              <Input />
            </Field>

            <Field labelNode={t("lanNatDirect")}>
              <Switch />
            </Field>

            <Field labelNode={t("wanInterface")} isRequired>
              <Input />
            </Field>

            <Field labelNode={t("allowInsecure")}>
              <Switch />
            </Field>

            <Field labelNode={t("dialMode")}>
              <Select>
                <option>ip</option>
                <option>domain</option>
                <option>domain+</option>
              </Select>
            </Field>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Flex gap={2}>
            <Button onClick={onClose}>{t("cancel")}</Button>

            <Button bg="Highlight" onClick={onClose}>
              {t("confirm")}
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
