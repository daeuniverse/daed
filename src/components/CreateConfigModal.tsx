import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
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

const Field = ({ labelNode, children }: { labelNode: React.ReactNode; children: React.ReactNode }) => (
  <FormControl>
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
        <ModalHeader>{t("create config")}</ModalHeader>

        <ModalBody>
          <Flex direction="column" gap={4}>
            <Field labelNode={t("tproxyPort")}>
              <NumberInput min={0} max={65535} />
            </Field>

            <Field labelNode={t("logLevel")}>
              <Slider step={25} textAlign="center">
                <SliderMark value={25} {...sliderLabelStyles}>
                  error
                </SliderMark>
                <SliderMark value={50} {...sliderLabelStyles}>
                  warning
                </SliderMark>
                <SliderMark value={75} {...sliderLabelStyles}>
                  info
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

            <Field labelNode={t("lanInterface")}>
              <Input />
            </Field>

            <Field labelNode={t("lanNatDirect")}>
              <Switch />
            </Field>

            <Field labelNode={t("wanInterface")}>
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
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
