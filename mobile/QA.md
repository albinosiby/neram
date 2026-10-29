# Mobile QA

Implementation is being validated by the Flutter mobile GitHub Actions workflow. This document will be updated with the observed results; the existence of tests does not mean they have passed.

Local Flutter dependency setup was rejected by automatic approval review when a dependency attempted cloud-metadata access. No metadata access was authorized or retried. Native compilation and execution are delegated to isolated GitHub-hosted CI runners without this session's credentials.

No physical Android phone is connected to this session. Hardware keyboard, system back, Android font scaling, external Maps launch, APK installation and real-device rendering must be verified on a phone before treating this as a production release. An Android emulator test is distinct from physical-device testing.
